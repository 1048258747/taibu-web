// Agent 核心：把太卜工具 schema 转成 LLM function calling 定义，
// 并驱动「模型决策 → 调用工具 → 模型解读」的多轮循环（支持流式）。
// 本模块不直接读写 localStorage，所有环境依赖通过参数注入，便于复用与测试。

const MAX_TOOL_ROUNDS = 4;
const TOOL_RESULT_LIMIT = 8000;

function sanitizeSchema(schema) {
  if (!schema || typeof schema !== "object") return { type: "object", properties: {} };
  const out = {};
  if (schema.type) out.type = schema.type;
  if (schema.description) out.description = schema.description;
  if (Array.isArray(schema.enum) && schema.enum.length) out.enum = schema.enum;
  if (schema.default !== undefined) out.default = schema.default;
  if (schema.minimum !== undefined) out.minimum = schema.minimum;
  if (schema.maximum !== undefined) out.maximum = schema.maximum;
  if (schema.items) out.items = sanitizeSchema(schema.items);
  if (schema.properties) {
    out.type = out.type || "object";
    out.properties = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      out.properties[key] = sanitizeSchema(value);
    }
  }
  if (Array.isArray(schema.required) && schema.required.length) out.required = schema.required;
  return out;
}

// 太卜工具定义 → OpenAI / DeepSeek / MiMo 通用的 function calling 声明
export function toOpenAiTools(toolDefs) {
  return (toolDefs || []).map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description || "",
      parameters: sanitizeSchema(tool.inputSchema),
    },
  }));
}

function endpointOf(settings) {
  const baseUrl = String(settings.baseUrl || "").replace(/\/+$/, "");
  if (!baseUrl) throw new Error("请填写接口地址");
  return `${baseUrl}/chat/completions`;
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseStreamChunk(json, state, onDelta) {
  const choice = json.choices?.[0];
  if (!choice) return;
  const delta = choice.delta || {};
  const content = delta.content || delta.text || json.output_text || "";
  if (content) {
    state.content += content;
    onDelta?.(content);
  }
  const calls = delta.tool_calls;
  if (!Array.isArray(calls)) return;
  for (const call of calls) {
    const index = typeof call.index === "number" ? call.index : 0;
    if (!state.toolCalls[index]) state.toolCalls[index] = { id: "", name: "", arguments: "" };
    const slot = state.toolCalls[index];
    if (call.id) slot.id = call.id;
    if (call.function?.name) slot.name += call.function.name;
    if (call.function?.arguments) slot.arguments += call.function.arguments;
  }
}

// 单轮请求：返回 { content, toolCalls }
async function requestCompletion({ settings, messages, tools, onDelta }) {
  const body = {
    model: settings.model,
    messages,
    temperature: 0.7,
    stream: true,
  };
  if (tools && tools.length) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  const resp = await fetch(endpointOf(settings), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${String(settings.apiKey || "").trim()}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    let message = `接口请求失败（${resp.status}）`;
    try {
      const data = await resp.json();
      message = data.error?.message || data.message || message;
    } catch {
      // 保留默认错误信息。
    }
    const error = new Error(message);
    error.status = resp.status;
    throw error;
  }

  // 个别网关会改写 content-encoding 导致拿不到流，退回整段 JSON 解析
  if (!resp.body || !resp.body.getReader) {
    const data = await resp.json();
    const message = data.choices?.[0]?.message || {};
    const content = message.content || data.reply || data.output_text || "";
    if (content) onDelta?.(content);
    return {
      content: String(content || ""),
      toolCalls: (message.tool_calls || []).map((call) => ({
        id: call.id || "",
        name: call.function?.name || "",
        arguments: call.function?.arguments || "{}",
      })),
    };
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  const state = { content: "", toolCalls: [] };
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      const json = safeParseJson(payload);
      if (json) parseStreamChunk(json, state, onDelta);
    }
  }

  return { content: state.content, toolCalls: state.toolCalls.filter((call) => call && call.name) };
}

// 无原生 function calling 的模型：从纯文本回复里识别 {"tool":..,"args":..} 协议
export function parseTextToolCall(text) {
  const source = String(text || "");
  if (!source.includes("tool")) return null;
  const fenced = source.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : source;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const parsed = safeParseJson(candidate.slice(start, end + 1));
  if (!parsed) return null;
  const name = parsed.tool || parsed.tool_name || parsed.name;
  if (!name || typeof name !== "string") return null;
  let args = parsed.arguments ?? parsed.args ?? parsed.parameters ?? {};
  if (typeof args === "string") args = safeParseJson(args) || {};
  return { name, args: args && typeof args === "object" ? args : {} };
}

const TEXT_PROTOCOL_HINT = [
  "【工具调用协议】你没有原生函数调用能力，需要排盘时，请只输出一个 JSON 代码块，不要输出其它文字：",
  '```json\n{"tool":"工具名","args":{"参数名":"参数值"}}\n```',
  "收到工具结果后，再正常输出解读文字。",
].join("\n");

function toolResultText(payload) {
  const text = payload?.text || "";
  return text.length > TOOL_RESULT_LIMIT ? `${text.slice(0, TOOL_RESULT_LIMIT)}\n…（结果过长已截断）` : text;
}

function normalizeArgs(raw) {
  const parsed = typeof raw === "string" ? safeParseJson(raw) : raw;
  return parsed && typeof parsed === "object" ? parsed : {};
}

/**
 * 驱动一次 Agent 对话。
 * onEvent 事件：
 *   {type:"round", round}                   新一轮助手输出开始（UI 应重置当前流式气泡）
 *   {type:"delta", text}                    流式文本片段
 *   {type:"tool", name, args}               开始调用工具
 *   {type:"tool-done", name, ok, summary}   工具返回
 *   {type:"notice", message}                提示信息（如降级、重试）
 * 返回 { text, trace }
 */
export async function runAgent({
  settings,
  systemPrompt,
  history = [],
  userText,
  tools = [],
  executeTool,
  onEvent,
  signal,
}) {
  if (!String(settings?.apiKey || "").trim()) {
    throw new Error("请先填写模型接口密钥");
  }
  if (!settings?.model) {
    throw new Error("请先选择模型");
  }

  const emit = (event) => onEvent?.(event);
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userText },
  ];

  const trace = [];
  let useNativeTools = tools.length > 0;
  let lastText = "";

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    if (signal?.aborted) throw new Error("已取消");
    emit({ type: "round", round });

    let result;
    try {
      result = await requestCompletion({
        settings,
        messages,
        tools: useNativeTools ? tools : null,
        onDelta: (text) => emit({ type: "delta", text }),
      });
    } catch (error) {
      const unsupported =
        useNativeTools && error.status === 400 && /tool|function|unsupported|不支持/i.test(error.message);
      if (!unsupported) throw error;
      // 模型不支持 function calling：降级为文本 JSON 协议，重跑本轮
      useNativeTools = false;
      messages[0] = { role: "system", content: `${systemPrompt}\n\n${TEXT_PROTOCOL_HINT}` };
      emit({ type: "notice", message: "当前模型不支持原生工具调用，已切换为文本协议。" });
      round -= 1;
      continue;
    }

    lastText = result.content;

    let calls = result.toolCalls;
    if (!calls.length && !useNativeTools && tools.length && result.content) {
      const textCall = parseTextToolCall(result.content);
      if (textCall) calls = [{ id: `text-${round}`, name: textCall.name, arguments: JSON.stringify(textCall.args) }];
    }

    if (!calls.length) {
      return { text: result.content.trim(), trace };
    }

    const known = new Set(tools.map((tool) => tool.function?.name).filter(Boolean));
    const runnable = calls.filter((call) => known.has(call.name));
    if (!runnable.length) {
      return { text: result.content.trim(), trace };
    }

    messages.push({
      role: "assistant",
      content: result.content || "",
      tool_calls: runnable.map((call) => ({
        id: call.id || `call-${call.name}`,
        type: "function",
        function: { name: call.name, arguments: call.arguments || "{}" },
      })),
    });

    for (const call of runnable) {
      const args = normalizeArgs(call.arguments);
      emit({ type: "tool", name: call.name, args });
      let ok = true;
      let text = "";
      try {
        const payload = await executeTool(call.name, args);
        text = toolResultText(payload);
      } catch (error) {
        ok = false;
        text = `工具执行失败：${error.message}`;
      }
      trace.push({ name: call.name, args, ok, text });
      emit({ type: "tool-done", name: call.name, ok, summary: text.slice(0, 120) });
      messages.push({
        role: "tool",
        tool_call_id: call.id || `call-${call.name}`,
        content: text || "（无输出）",
      });
    }
  }

  return { text: lastText.trim(), trace };
}
