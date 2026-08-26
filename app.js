const LABELS = {
  gender: "性别",
  birthYear: "出生年",
  birthMonth: "出生月",
  birthDay: "出生日",
  birthHour: "出生时",
  birthMinute: "出生分",
  calendarType: "历法",
  isLeapMonth: "农历闰月",
  birthPlace: "出生地",
  latitude: "纬度",
  longitude: "经度",
  question: "问题",
  date: "日期时间",
  hour: "时辰",
  minute: "分钟",
  timezone: "时区",
  year: "年",
  month: "月",
  day: "日",
  mode: "观测尺度",
  targetDate: "目标日期",
  targetTimeIndex: "目标时辰",
  yongShenTargets: "用神目标",
  method: "起卦方式",
  numbers: "数字",
  hexagramName: "本卦",
  changedHexagramName: "变卦",
  seed: "随机种子",
  spreadType: "牌阵",
  queries: "飞星查询",
  lunarMonth: "农历月",
  lunarDay: "农历日",
  yearPillar: "年柱",
  monthPillar: "月柱",
  dayPillar: "日柱",
  hourPillar: "时柱",
  houseSystem: "宫制",
  detailLevel: "输出详细度",
  startDate: "开始日期",
  endDate: "结束日期",
  customDate: "自定义时间",
  transitDateTime: "流运时刻",
  latitudeLabel: "纬度",
  longitudeLabel: "经度",
  allowReversed: "允许逆位",
  count: "数量",
  countCategory: "计数类别",
  text: "文本内容",
  textSplitMode: "文本拆字方式",
  multiSentenceStrategy: "多句取用",
  sentences: "句子列表",
  leftStrokeCount: "左字笔画",
  rightStrokeCount: "右字笔画",
  measureKind: "测量单位",
  majorValue: "主数值",
  minorValue: "次数值",
  upperCue: "上卦线索",
  upperCueCategory: "上卦类别",
  lowerCue: "下卦线索",
  lowerCueCategory: "下卦类别",
  upperTrigram: "上卦",
  lowerTrigram: "下卦",
  movingLine: "动爻",
  panType: "排盘类型",
  juMethod: "定局方法",
  zhiFuJiGong: "值符寄宫",
  dayMaster: "日主",
  lunarMonth: "农历月",
  lunarDay: "农历日",
  replay: "随机样本回放",
  participants: "参与人列表",
};

const ENUM_LABELS = {
  male: "男",
  female: "女",
  solar: "公历",
  lunar: "农历",
  auto: "自动",
  select: "选卦",
  time: "时间",
  number: "数字",
  item: "物数",
  sound: "声数",
  default: "标准",
  more: "详细",
  full: "完整",
  single: "单张",
  "three-card": "三张牌",
  love: "爱情",
  "celtic-cross": "凯尔特十字",
  horseshoe: "马蹄",
  decision: "抉择",
  "mind-body-spirit": "身心灵",
  situation: "情境",
  "yes-no": "是否",
  count_with_time: "计数加时间",
  text_split: "文字拆解",
  measure: "尺寸丈尺",
  classifier_pair: "类象配对",
  number_pair: "两数",
  number_triplet: "三数",
  count: "按字数",
  sentence_pair: "句子配对",
  stroke: "笔画",
  first: "第一句",
  last: "最后一句",
  zhuan: "转盘",
  chaibu: "拆补法",
  maoshan: "茅山法",
  ji_liuyi: "寄六仪",
  ji_wugong: "寄五宫",
  year: "年",
  month: "月",
  day: "日",
  hour: "时",
  minute: "分",
  direction: "方位",
  color: "颜色",
  weather: "天气",
  person: "人物",
  body: "身体",
  animal: "动物",
  object: "物品",
  shape: "形状",
  trigram: "八卦",
  placidus: "普拉西度制",
};

const TOOL_META = {
  bazi: { icon: "八字", tint: "#f2e7cf", ink: "#9a7b3f" },
  bazi_dayun: { icon: "运", tint: "#dce9e5", ink: "#2f6f6a" },
  bazi_pillars_resolve: { icon: "柱", tint: "#efe1e8", ink: "#8a4b6a" },
  ziwei: { icon: "紫", tint: "#e5e3f0", ink: "#5d4f94" },
  ziwei_horoscope: { icon: "限", tint: "#dce9e5", ink: "#2f6f6a" },
  ziwei_flying_star: { icon: "飞", tint: "#f2e7cf", ink: "#9a7b3f" },
  liuyao: { icon: "爻", tint: "#fae7e2", ink: "#a83f34" },
  meihua: { icon: "梅", tint: "#f5dfe4", ink: "#a54f6b" },
  qimen: { icon: "遁", tint: "#e2e8ef", ink: "#35597a" },
  daliuren: { icon: "壬", tint: "#dce9e5", ink: "#2f6f6a" },
  xiaoliuren: { icon: "小", tint: "#f2e7cf", ink: "#9a7b3f" },
  tarot: { icon: "塔", tint: "#efe1e8", ink: "#8a4b6a" },
  almanac: { icon: "历", tint: "#fae7e2", ink: "#a83f34" },
  astrology: { icon: "星", tint: "#e2e8ef", ink: "#35597a" },
  taiyi: { icon: "乙", tint: "#e5e3f0", ink: "#5d4f94" },
};

const TOOL_NAMES = {
  astrology: "西方占星",
  bazi: "八字排盘",
  bazi_dayun: "八字大运",
  bazi_pillars_resolve: "四柱反推",
  ziwei: "紫微斗数",
  ziwei_horoscope: "紫微运限",
  ziwei_flying_star: "紫微飞星",
  liuyao: "六爻占卜",
  meihua: "梅花易数",
  qimen: "奇门遁甲",
  daliuren: "大六壬",
  xiaoliuren: "小六壬",
  tarot: "塔罗抽牌",
  almanac: "黄历查询",
  taiyi: "太乙九星",
};

const AI_SETTINGS_KEY = "taibu:ai-settings";
const PROFILES_KEY = "taibu:profiles";
const ACTIVE_PROFILE_KEY = "taibu:active-profile";

const AI_PROVIDERS = {
  minimax: {
    label: "MiniMax M3",
    baseUrl: "https://api.minimax.chat/v1",
    model: "minimax-m3",
  },
  deepseek: {
    label: "DeepSeek V4 Flash",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-v4-flash",
  },
};

const state = {
  tools: [],
  loading: true,
  error: "",
  reportLoading: false,
  reportError: "",
};

const app = document.getElementById("app");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMarkdown(source) {
  const inline = (text) =>
    escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");

  const lines = String(source || "").split(/\r?\n/);
  const out = [];
  let list = [];
  let table = [];

  const flushList = () => {
    if (!list.length) return;
    out.push(`<ul class="markdown-list">${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  const flushTable = () => {
    if (!table.length) return;
    const [head, ...body] = table;
    const rows = body[0] && body[0].every((cell) => /^:?-{2,}:?$/.test(cell)) ? body.slice(1) : body;
    out.push(
      `<div class="markdown-table-wrap"><table><thead><tr>${head
        .map((cell) => `<th>${inline(cell)}</th>`)
        .join("")}</tr></thead><tbody>${rows
        .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div>`
    );
    table = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^\|.+\|$/.test(line)) {
      flushList();
      const cells = line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      if (!table.length || table[0].length !== cells.length) {
        flushTable();
        table = [cells];
      } else {
        table.push(cells);
      }
      continue;
    }

    flushTable();
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushList();
      const level = Math.min(4, heading[1].length + 1);
      out.push(`<h${level} class="markdown-h${level}">${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      list.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    flushList();
    if (!line) {
      out.push("");
      continue;
    }
    out.push(`<p class="markdown-p">${inline(line)}</p>`);
  }

  flushList();
  flushTable();
  return out.join("\n");
}

function getToolMeta(name) {
  return TOOL_META[name] || { icon: "术", tint: "#efe7da", ink: "#5d574e" };
}

function getToolDefinition(name) {
  return state.tools.find((tool) => tool.name === name) || null;
}

function parseHash() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [path, queryString] = raw.split("?");
  const segments = path.split("/").filter(Boolean);
  const params = new URLSearchParams(queryString || "");
  return { path, segments, params };
}

function saveHistory(toolName, request, response) {
  const item = {
    tool: toolName,
    request,
    response,
    time: new Date().toISOString(),
  };
  localStorage.setItem(`taibu:last:${toolName}`, JSON.stringify(item));
  const history = JSON.parse(localStorage.getItem("taibu:history") || "[]");
  history.unshift(item);
  localStorage.setItem("taibu:history", JSON.stringify(history.slice(0, 50)));
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("taibu:history") || "[]");
  } catch {
    return [];
  }
}

function getProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
    return Array.isArray(profiles) ? profiles : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function getActiveProfile() {
  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY) || "";
  return getProfiles().find((profile) => profile.id === activeId) || null;
}

function setActiveProfile(profileId) {
  if (profileId) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  } else {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
}

function profileId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function profileFromRequest(name, request, existing) {
  return {
    id: existing?.id || profileId(),
    name: name.trim() || existing?.name || "未命名档案",
    gender: request.gender || "male",
    birthYear: Number(request.birthYear) || 1990,
    birthMonth: Number(request.birthMonth) || 1,
    birthDay: Number(request.birthDay) || 15,
    birthHour: Number(request.birthHour) || 12,
    birthMinute: Number(request.birthMinute) || 0,
    calendarType: request.calendarType || "solar",
    isLeapMonth: Boolean(request.isLeapMonth),
    birthPlace: request.birthPlace || "",
    longitude: request.longitude === undefined ? undefined : Number(request.longitude),
    latitude: request.latitude === undefined ? undefined : Number(request.latitude),
    updatedAt: new Date().toISOString(),
  };
}

function profileToRequest(profile) {
  return {
    gender: profile.gender,
    birthYear: profile.birthYear,
    birthMonth: profile.birthMonth,
    birthDay: profile.birthDay,
    birthHour: profile.birthHour,
    birthMinute: profile.birthMinute,
    calendarType: profile.calendarType,
    isLeapMonth: profile.isLeapMonth,
    birthPlace: profile.birthPlace,
    longitude: profile.longitude,
    latitude: profile.latitude,
  };
}

function profileSummary(profile) {
  if (!profile) return "临时输入";
  const gender = profile.gender === "female" ? "女" : "男";
  const calendar = profile.calendarType === "lunar" ? "农历" : "公历";
  return `${profile.name} · ${gender} · ${calendar}${profile.birthYear}年${profile.birthMonth}月${profile.birthDay}日`;
}

function applyProfileToForm(profile) {
  const form = document.querySelector("[data-tool-form]");
  const nameInput = document.querySelector("[data-profile-name]");
  if (form && profile) {
    Object.entries(profileToRequest(profile)).forEach(([key, value]) => {
      const field = form.querySelector(`[data-field="${key}"]`);
      if (!field) return;
      if (field.type === "checkbox") {
        field.checked = Boolean(value);
      } else {
        field.value = value ?? "";
      }
    });
  }
  if (nameInput) {
    nameInput.value = profile?.name || "";
  }
}

function saveProfileFromPage() {
  const form = document.querySelector("[data-tool-form]");
  const nameInput = document.querySelector("[data-profile-name]");
  const values = form ? collectFormValues(form) : {};
  const name = nameInput?.value || "";
  const existing = getActiveProfile();
  const profile = profileFromRequest(name, values, existing);
  const profiles = getProfiles().filter((item) => item.id !== profile.id);
  profiles.push(profile);
  saveProfiles(profiles);
  setActiveProfile(profile.id);
  render();
}

function getAiSettings() {
  const fallback = {
    provider: "deepseek",
    apiKey: "",
    model: AI_PROVIDERS.deepseek.model,
    baseUrl: AI_PROVIDERS.deepseek.baseUrl,
  };
  try {
    const saved = JSON.parse(localStorage.getItem(AI_SETTINGS_KEY) || "{}");
    const provider = AI_PROVIDERS[saved.provider] ? saved.provider : fallback.provider;
    return {
      provider,
      apiKey: saved.apiKey || "",
      model: saved.model || AI_PROVIDERS[provider].model || "",
      baseUrl: saved.baseUrl || AI_PROVIDERS[provider].baseUrl || "",
    };
  } catch {
    return fallback;
  }
}

function saveAiSettings(settings) {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
}

function buildAiPrompt(toolName, item) {
  const tool = getToolDefinition(toolName);
  const title = toolLabel(toolName);
  const input = item.request ? JSON.stringify(item.request, null, 2) : "";
  const text = item.response?.text || "";
  const structured = item.response?.structured || null;
  const structuredText = structured ? JSON.stringify(structured, null, 2) : "";

  return [
    `工具：${title}`,
    tool?.description ? `说明：${tool.description}` : "",
    `用户输入：\n${input}`,
    `排盘结果：\n${text}`,
    structuredText ? `结构化数据：\n${structuredText}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 12000);
}

function getChatMessages(item) {
  if (Array.isArray(item.chat) && item.chat.length) {
    return item.chat.slice(-24);
  }
  if (item.ai?.text) {
    return [{ role: "assistant", content: item.ai.text }];
  }
  return [];
}

async function callAiApi(systemPrompt, userText, history = []) {
  const settings = getAiSettings();
  if (!settings.apiKey.trim()) {
    throw new Error("请先填写模型接口密钥");
  }

  const provider = AI_PROVIDERS[settings.provider];
  const baseUrl = (settings.baseUrl || provider.baseUrl || "").replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("请填写接口地址");
  }

  const model = settings.model || provider.model || "";
  if (!model) {
    throw new Error("请填写模型名称");
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userText },
  ];

  const isMinimax = settings.provider === "minimax";
  const url = isMinimax ? `${baseUrl}/text/chatcompletion_v2` : `${baseUrl}/chat/completions`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    let message = `接口请求失败（${response.status}）`;
    try {
      const data = await response.json();
      message = data.error?.message || data.message || message;
    } catch {
      // 保留默认错误信息。
    }
    throw new Error(message);
  }

  const data = await response.json();
  const content =
    data.choices?.[0]?.message?.content || data.reply || data.output_text || "";
  if (!content.trim()) {
    throw new Error("模型没有返回解读内容");
  }
  return content.trim();
}

async function callAiChat(toolName, item, userText) {
  const systemPrompt = [
    "你是传统命理排盘工具的命理顾问，像一位经验丰富但严谨的传统命理师。",
    "请结合用户档案、当前排盘结果和对话历史回答。",
    "回答时先说明依据，再给建议；排盘结果里没有的信息要明确说不确定，不能编造。",
    "不要承诺确定结果，不做医疗、投资、法律等决策建议。",
    "结尾提醒仅供传统文化研究与娱乐参考。",
    "本次计算依据如下：",
    buildAiPrompt(toolName, item),
  ].join("\n\n");
  return callAiApi(systemPrompt, userText, getChatMessages(item));
}

async function callAiReading(toolName, item) {
  return callAiChat(toolName, item, "请结合我的档案和排盘结果，给出完整解读。");
}

function saveAiReading(toolName, aiText) {
  const key = `taibu:last:${toolName}`;
  const stored = localStorage.getItem(key);
  if (!stored) return;
  try {
    const item = JSON.parse(stored);
    item.ai = {
      text: aiText,
      time: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch {
    // 历史记录损坏时忽略。
  }
}

function saveChat(toolName, messages) {
  const key = `taibu:last:${toolName}`;
  const stored = localStorage.getItem(key);
  if (!stored) return;
  try {
    const item = JSON.parse(stored);
    item.chat = messages.slice(-30);
    delete item.ai;
    localStorage.setItem(key, JSON.stringify(item));
  } catch {
    // 历史记录损坏时忽略。
  }
}

function formatTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
}

function todayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

// 本地离线引擎：优先在浏览器内计算（APK / 离线环境必需），失败时回退到后端
let offlineEngine = null;
async function loadOfflineEngine() {
  if (offlineEngine !== null) return offlineEngine;
  try {
    offlineEngine = await import("./taibu-engine.js");
  } catch (error) {
    offlineEngine = null;
    console.warn("离线引擎加载失败，将回退到后端:", error);
  }
  return offlineEngine;
}

async function apiRequest(path, options) {
  const engine = await loadOfflineEngine();
  if (engine) {
    try {
      if (path === "/api/tools") {
        return { ok: true, tools: engine.listTools() };
      }
      const match = path.match(/^\/api\/tool\/([^/]+)$/);
      if (match) {
        const toolName = decodeURIComponent(match[1]);
        const body = options && options.body ? JSON.parse(options.body) : {};
        return await engine.runTool(toolName, body);
      }
    } catch (error) {
      // 未知工具才回退到后端；校验/计算错误直接抛出
      if (!/未知工具/.test(error.message)) throw error;
    }
  }
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || "计算失败");
  }
  return data;
}

async function callToolApi(toolName, args) {
  return apiRequest(`/api/tool/${encodeURIComponent(toolName)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
}

function toolLabel(name) {
  const def = getToolDefinition(name);
  return TOOL_NAMES[name] || (def ? def.name : name);
}

function translateHint(text) {
  return String(text || "")
    .replace(/YYYY-MM-DDTHH:mm\[:ss\]/gi, "公历日期时间")
    .replace(/YYYY-MM-DDTHH:MM\[:SS\]/gi, "公历日期时间")
    .replace(/YYYY-MM-DD HH:MM\[:SS\]/gi, "公历日期时间")
    .replace(/YYYY-MM-DD/g, "公历日期")
    .replace(/ISO 时间/gi, "标准时间")
    .replace(/placidus/gi, "普拉西度制")
    .replace(/solar=公历，lunar=农历/gi, "公历或农历")
    .replace(/auto=自动，select=指定卦，time=时间，number=数字/gi, "自动、指定卦、时间、数字")
    .replace(
      /time=时间，count_with_time=物数或声数，text_split=字占，measure=丈尺尺寸，classifier_pair=类象对，select=指定卦，number_pair\/number_triplet=报数/gi,
      "时间、物数或声数、字占、丈尺尺寸、类象对、指定卦、报数"
    )
    .replace(/item=物数，sound=声数/gi, "物数或声数")
    .replace(/auto=自动，count=按字数，sentence_pair=按句，stroke=按笔画/gi, "自动、按字数、按句、按笔画")
    .replace(/first=首句，last=末句/gi, "首句或末句")
    .replace(
      /single=单牌，three-card=三牌，love=爱情，celtic-cross=凯尔特十字，horseshoe=马蹄，decision=抉择，mind-body-spirit=身心灵，situation=处境，yes-no=是否/gi,
      "单牌、三牌、爱情、凯尔特十字、马蹄、抉择、身心灵、处境或是否"
    )
    .replace(/year=年，month=月，day=日，hour=时，minute=分钟/gi, "年、月、日、时、分钟")
    .replace(/zhuan=转盘/gi, "转盘")
    .replace(/chaibu=拆补，maoshan=茅山/gi, "拆补或茅山")
    .replace(/ji_liuyi=寄六仪，ji_wugong=寄戊宫/gi, "寄六仪或寄戊宫")
    .replace(/IANA 时区/gi, "标准时区")
    .replace(/（\s*）/g, "")
    .replace(/\(\s*\)/g, "");
}

function renderShell(content, activeNav = "") {
  return `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#/">
          <span class="brand-title">太卜排盘</span>
        </a>
      </header>
      <main class="page">${content}</main>
      <nav class="bottom-nav">
        <button data-action="home" data-icon="宅" class="${activeNav === "home" ? "is-active" : ""}">首页</button>
        <button data-action="ai-settings" data-icon="智" class="${activeNav === "ai" ? "is-active" : ""}">AI模型</button>
      </nav>
    </div>
  `;
}

function renderHome() {
  const active = getActiveProfile();
  const heading = `
    <h1 class="page-heading">今日助手</h1>
    <p class="page-subtitle">今日报告、解梦和排盘工具都在这里。</p>
  `;
  const reportReady = active ? Boolean(getDailyReportCache(active)) : false;
  const reportEntry = `
    <section class="panel home-report-entry">
      <div class="home-report-copy">
        <span class="home-report-label">今日</span>
        <h2>今日报告</h2>
        <p>${active ? (reportReady ? "今日报告已生成，轻点查看。" : "今日报告待生成，轻点查看。") : "保存命主档案后可生成今日报告。"}</p>
      </div>
      <button class="primary-button" data-action="${active ? "report" : "profiles"}">${active ? "查看" : "选择档案"}</button>
    </section>
  `;

  if (state.loading) {
    return renderShell(`${heading}<div class="loading-box"><div><div class="spinner"></div><div>正在加载工具...</div></div></div>`, "home");
  }

  if (state.error) {
    return renderShell(`${heading}<div class="error-box">${escapeHtml(state.error)}</div>`, "home");
  }

  const cards = state.tools
    .map((tool) => {
      const meta = getToolMeta(tool.name);
      return `
        <button class="tool-card" data-tool="${escapeHtml(tool.name)}" data-seal="${escapeHtml(meta.icon)}" style="--card-accent:${meta.tint};--card-tint:${meta.tint};--card-ink:${meta.ink}">
          <span class="tool-icon">${escapeHtml(meta.icon)}</span>
          <h3>${escapeHtml(toolLabel(tool.name))}</h3>
          <p>${escapeHtml(tool.description || "输入对应信息后开始排盘")}</p>
          <span class="tool-card-action">开始排盘</span>
        </button>
      `;
    })
    .join("");

  const moreEntry = `
    <div class="home-more">
      <button class="home-more-item" data-action="profiles">
        <span class="home-more-icon">册</span>
        <span>
          <strong>命主档案</strong>
          <small>管理出生信息</small>
        </span>
      </button>
      <button class="home-more-item" data-action="history">
        <span class="home-more-icon">史</span>
        <span>
          <strong>历史记录</strong>
          <small>查看过往排盘</small>
        </span>
      </button>
    </div>
  `;

  return renderShell(
    `${heading}${reportEntry}<div class="section-heading"><h2>排盘工具</h2></div><div class="tool-grid">${cards}</div>${moreEntry}<p class="disclaimer">本工具仅供传统文化研究与娱乐参考，不构成任何决策建议。</p>`,
    "home"
  );
}

function getDailyReportCache(profile) {
  if (!profile) return null;
  const date = todayString();
  try {
    const data = JSON.parse(localStorage.getItem(`taibu:daily:${profile.id}:${date}`) || "null");
    if (data && data.date === date && data.report) return data;
  } catch {
    // 缓存损坏时重新生成。
  }
  return null;
}

function saveDailyReportCache(profile, report) {
  const date = todayString();
  localStorage.setItem(
    `taibu:daily:${profile.id}:${date}`,
    JSON.stringify({ date, profileId: profile.id, report })
  );
}

async function generateDailyReport(profile) {
  const date = todayString();
  const birth = profileToRequest(profile);
  const almanac = await callToolApi("almanac", { ...birth, date });
  return {
    date,
    generatedAt: new Date().toISOString(),
    almanac: {
      text: almanac.text,
      structured: almanac.structured || null,
      raw: almanac.raw || null,
    },
    ai: null,
  };
}

function extractAlmanacData(almanac) {
  const raw = (almanac && almanac.raw) || {};
  const a = raw.almanac || {};
  const structured = (almanac && almanac.structured) || {};
  const base = structured["基础与个性化坐标"] || {};
  const tone = structured["传统黄历基调"] || {};
  const yiji = structured["择日宜忌"] || {};
  const shensha = structured["神煞参考"] || {};
  return {
    dayMaster: raw.dayMaster || "",
    ganZhi: raw.dayInfo?.ganZhi || base["日干支"] || "",
    tenGod: raw.tenGod || base["流日十神"] || "",
    lunarDate: a.lunarDate || tone["农历"] || "",
    zodiac: a.zodiac || tone["生肖"] || "",
    suitable: a.suitable || yiji["宜"] || [],
    avoid: a.avoid || yiji["忌"] || [],
    chongSha: a.chongSha || tone["冲煞"] || "",
    jishen: a.jishen || shensha["吉神宜趋"] || [],
    xiongsha: a.xiongsha || shensha["凶煞宜忌"] || [],
    pengZuBaiJi: a.pengZuBaiJi || tone["彭祖百忌"] || "",
    directions: a.directions || {},
    hourlyFortune: a.hourlyFortune || [],
    dayNineStar: a.dayNineStar || {},
    nayin: a.nayin || "",
    dayOfficer: a.dayOfficer || "",
    tianShen: a.tianShen || "",
    tianShenType: a.tianShenType || "",
    tianShenLuck: a.tianShenLuck || "",
  };
}

const GAN_WU_XING = { 甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土", 己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水" };

function renderAlmanacBox(almanac) {
  const d = extractAlmanacData(almanac);
  const suitable = d.suitable.length ? d.suitable.join("、") : "—";
  const avoid = d.avoid.length ? d.avoid.join("、") : "—";
  const jishen = d.jishen.length ? d.jishen.join("、") : "—";
  const xiongsha = d.xiongsha.length ? d.xiongsha.join("、") : "—";
  const dirs = d.directions;
  const dirItems = [
    dirs.caiShen ? `<span>财神 <b>${escapeHtml(dirs.caiShen)}</b></span>` : "",
    dirs.xiShen ? `<span>喜神 <b>${escapeHtml(dirs.xiShen)}</b></span>` : "",
    dirs.fuShen ? `<span>福神 <b>${escapeHtml(dirs.fuShen)}</b></span>` : "",
    dirs.yangGui ? `<span>阳贵 <b>${escapeHtml(dirs.yangGui)}</b></span>` : "",
    dirs.yinGui ? `<span>阴贵 <b>${escapeHtml(dirs.yinGui)}</b></span>` : "",
  ]
    .filter(Boolean)
    .join("");
  const luckyHours = d.hourlyFortune
    .filter((h) => h.tianShenLuck === "吉")
    .map(
      (h) =>
        `<span class="lucky-hour"><b>${escapeHtml(
          h.timeRange || h.ganZhi
        )}</b><i>${escapeHtml(h.tianShen)}</i></span>`
    )
    .join("");
  const dayMasterWuXing = GAN_WU_XING[d.dayMaster] || "";
  const personalLine = d.dayMaster
    ? `<div class="report-calc-personal"><span class="report-calc-personal-label">您的日主</span><strong>${escapeHtml(
        d.dayMaster
      )}（${escapeHtml(dayMasterWuXing)}）</strong><span class="report-calc-personal-sub">今日流日十神：${escapeHtml(
        d.tenGod || "—"
      )}</span></div>`
    : "";
  const star = d.dayNineStar || {};
  const starText = star.description || "";
  const starExtra = [star.wuXing ? `五行 ${star.wuXing}` : "", star.color ? `颜色 ${star.color}` : ""]
    .filter(Boolean)
    .join(" · ");

  return `
    <section class="panel result-panel report-calc-box">
      <div class="report-calc-head">
        <h2>今日计算结果</h2>
        <span class="report-calc-tag">黄历引擎计算</span>
      </div>
      ${personalLine}
      <div class="report-calc-grid">
        <div class="report-calc-item">
          <span class="report-calc-label">今日干支</span>
          <span class="report-calc-value">${escapeHtml(d.ganZhi || "—")}日</span>
        </div>
        <div class="report-calc-item">
          <span class="report-calc-label">农历</span>
          <span class="report-calc-value">${escapeHtml(d.lunarDate || "—")}</span>
        </div>
        ${d.tenGod ? `<div class="report-calc-item"><span class="report-calc-label">流日十神</span><span class="report-calc-value">${escapeHtml(d.tenGod)}</span></div>` : ""}
        ${d.zodiac ? `<div class="report-calc-item"><span class="report-calc-label">生肖</span><span class="report-calc-value">${escapeHtml(d.zodiac)}</span></div>` : ""}
      </div>
      <div class="report-calc-block">
        <div class="report-calc-block-title">宜</div>
        <div class="report-calc-tags">${escapeHtml(suitable)}</div>
      </div>
      <div class="report-calc-block">
        <div class="report-calc-block-title is-avoid">忌</div>
        <div class="report-calc-tags">${escapeHtml(avoid)}</div>
      </div>
      ${dirItems ? `<div class="report-calc-block"><div class="report-calc-block-title">方位</div><div class="report-calc-dirs">${dirItems}</div></div>` : ""}
      ${luckyHours ? `<div class="report-calc-block"><div class="report-calc-block-title">吉时</div><div class="report-calc-hours">${luckyHours}</div></div>` : ""}
      ${starText ? `<div class="report-calc-block"><div class="report-calc-block-title">日九星</div><div class="report-calc-text">${escapeHtml(starText)}${starExtra ? `<span class="report-calc-sub">${escapeHtml(starExtra)}</span>` : ""}</div></div>` : ""}
      ${d.chongSha ? `<div class="report-calc-block"><div class="report-calc-block-title">冲煞</div><div class="report-calc-text">${escapeHtml(d.chongSha)}</div></div>` : ""}
      ${jishen !== "—" ? `<div class="report-calc-block"><div class="report-calc-block-title">吉神</div><div class="report-calc-text">${escapeHtml(jishen)}</div></div>` : ""}
      ${xiongsha !== "—" ? `<div class="report-calc-block"><div class="report-calc-block-title">凶煞</div><div class="report-calc-text">${escapeHtml(xiongsha)}</div></div>` : ""}
      ${d.pengZuBaiJi ? `<div class="report-calc-block"><div class="report-calc-block-title">彭祖百忌</div><div class="report-calc-text">${escapeHtml(d.pengZuBaiJi)}</div></div>` : ""}
    </section>
  `;
}

function buildDailyAiData(report) {
  const d = extractAlmanacData(report.almanac);
  const luckyHours = d.hourlyFortune
    .filter((h) => h.tianShenLuck === "吉")
    .map((h) => `${h.timeRange || h.ganZhi}（${h.ganZhi}·${h.tianShen}）`);
  return {
    日期: report.date,
    日主: d.dayMaster ? `${d.dayMaster}（${GAN_WU_XING[d.dayMaster] || ""}）` : "",
    日干支: d.ganZhi ? `${d.ganZhi}日` : "",
    流日十神: d.tenGod || "",
    农历: d.lunarDate || "",
    生肖: d.zodiac || "",
    宜: d.suitable,
    忌: d.avoid,
    冲煞: d.chongSha || "",
    吉神: d.jishen,
    凶煞: d.xiongsha,
    彭祖百忌: d.pengZuBaiJi || "",
    方位: d.directions,
    吉时: luckyHours,
    日九星: d.dayNineStar.description || "",
    日九星五行: d.dayNineStar.wuXing || "",
    日九星颜色: d.dayNineStar.color || "",
    纳音: d.nayin || "",
    日建: d.dayOfficer ? `${d.dayOfficer}日` : "",
    值神: d.tianShen ? `${d.tianShen}（${d.tianShenType || ""}·${d.tianShenLuck || ""}）` : "",
  };
}

function buildDailyAiSystemPrompt(report) {
  return [
    "你是“太卜排盘”的今日报告解读助手。下面给出的是由黄历计算引擎严格计算得出的“今日计算结果”（JSON 数据）。",
    "",
    "【硬性要求】",
    "1. 只能解释计算结果中出现的内容；计算结果里没有的信息，一律不得编造、推测或补充。",
    "2. 每条建议都必须能在计算结果中找到依据，并明确写出依据（例如“今日宜出行，所以……”）。",
    "3. 穿搭颜色只能基于“当日五行”推导，五行→传统配色映射为：金→白/银/金，木→绿/青，水→黑/蓝，火→红/紫，土→黄/棕。必须说明这是传统五行配色参考，不是确定预测。没有天气数据，不要提天气。",
    "4. 计算结果里没有的具体时间点、具体事件等信息不要编造。",
    "5. 不确定的内容要明确说“不确定”，不要用模糊语言掩盖。",
    "6. 不做医疗、投资、法律等决策建议。",
    "7. 结尾提醒仅供传统文化研究与娱乐参考。",
    "",
    "【今日计算结果】",
    JSON.stringify(buildDailyAiData(report), null, 2),
  ].join("\n");
}

async function callAiDailyReport(report) {
  const data = buildDailyAiData(report);
  const draft = await callAiApi(buildDailyAiSystemPrompt(report), "请根据上面的计算结果，生成今日报告解读。");
  // AI 二次校验：对照计算结果核查草稿，修正编造/幻觉内容
  try {
    return await validateDailyAiText(data, draft);
  } catch {
    // 校验失败时回退到草稿，保证用户始终能看到结果
    return draft;
  }
}

async function validateDailyAiText(data, draft) {
  const systemPrompt = [
    "你是“太卜排盘”的今日报告校验助手。下面给出【计算结果数据】和【AI 草稿解读】。",
    "",
    "【任务】",
    "1. 逐条核对草稿中的事实性内容是否都能在计算结果数据中找到依据。",
    "2. 找出草稿中编造、推测或与数据不符的内容（例如数据里没有的具体时间点、宜忌、颜色、方位、事件、数字等），删除或改写为数据支持的表述。",
    "3. 保持草稿的整体结构、语气和长度，只修正错误，不要重写全文。",
    "4. 如果草稿完全符合数据，原样输出。",
    "5. 只输出修正后的解读正文，不要输出任何解释、说明或前缀。",
    "",
    "【计算结果数据】",
    JSON.stringify(data, null, 2),
  ].join("\n");
  return callAiApi(systemPrompt, `【AI 草稿解读】\n${draft}\n\n请按上述要求校验并只输出修正后的解读正文。`);
}

function renderDailyReport() {
  const active = getActiveProfile();
  if (!active) {
    return renderShell(
      `
        <h1 class="page-heading">今日报告</h1>
        <p class="page-subtitle">需要先选择命主档案，才能生成今日报告。</p>
        <div class="empty-box panel"><div><p>还没有选择命主档案。</p><button class="primary-button" data-action="profiles">前往档案</button></div></div>
      `,
      "home"
    );
  }

  if (state.reportError) {
    return renderShell(
      `
        <h1 class="page-heading">今日报告</h1>
        <div class="error-box">${escapeHtml(state.reportError)}</div>
        <button class="primary-button" data-action="retry-report">重新生成</button>
      `,
      "home"
    );
  }

  const cache = getDailyReportCache(active);
  if (!cache || state.reportLoading) {
    return renderShell(
      `
        <h1 class="page-heading">今日报告</h1>
        <div class="loading-box panel"><div><div class="spinner"></div><div>正在生成今日报告...</div></div></div>
      `,
      "home"
    );
  }

  const report = cache.report;
  return renderShell(
    `
      <div class="result-toolbar">
        <button class="secondary-button" data-action="home">返回首页</button>
        <button class="secondary-button" data-action="retry-report">重新生成</button>
      </div>
      <h1 class="page-heading">今日报告</h1>
      <p class="page-subtitle">${escapeHtml(profileSummary(active))} · ${escapeHtml(report.date)}</p>
      ${renderAlmanacBox(report.almanac)}
      ${renderDailyAiSection(report)}
      <p class="disclaimer">本工具仅供传统文化研究与娱乐参考，不构成任何决策建议。</p>
    `,
    "home"
  );
}

function renderDailyAiSection(report) {
  const settings = getAiSettings();
  const hasKey = Boolean(settings.apiKey);
  const ai = report.ai;
  const aiLoading = report.aiLoading;
  const aiError = report.aiError || "";

  let body;
  if (!hasKey) {
    body = `
      <div class="ai-setup-hint">
        <p>配置模型后，可自动生成通俗易懂的今日解读（严格基于计算结果）。</p>
        <button class="primary-button" data-action="ai-settings">前往模型设置</button>
      </div>
    `;
  } else if (aiLoading) {
    body = `
      <div class="loading-box panel"><div><div class="spinner"></div><div>正在生成今日解读...</div></div></div>
    `;
  } else if (ai && ai.text) {
    body = `
      <div class="result-text markdown-render">${renderMarkdown(ai.text)}</div>
      <div class="form-actions">
        <button class="secondary-button" data-action="ai-report-regenerate">重新生成解读</button>
      </div>
    `;
  } else if (aiError) {
    body = `
      <div class="error-box">${escapeHtml(aiError)}</div>
      <div class="form-actions">
        <button class="primary-button" data-action="ai-report-regenerate">重试生成解读</button>
      </div>
    `;
  } else {
    body = `
      <div class="form-actions">
        <button class="primary-button" data-action="ai-report-regenerate">生成今日解读</button>
      </div>
    `;
  }

  return `
    <section class="panel result-panel ai-panel report-ai-section">
      <div class="section-heading">
        <div>
          <h2>今日解读</h2>
          <p class="page-subtitle">AI 严格依据上方计算结果生成，不编造未计算的内容。</p>
        </div>
      </div>
      ${body}
    </section>
  `;
}

async function loadDailyReportIfNeeded() {
  const { segments } = parseHash();
  if (segments[0] !== "report" || state.reportLoading || state.reportError) return;
  const active = getActiveProfile();
  if (!active) return;

  let cache = getDailyReportCache(active);
  if (!cache) {
    state.reportLoading = true;
    try {
      const report = await generateDailyReport(active);
      saveDailyReportCache(active, report);
      state.reportError = "";
    } catch (error) {
      state.reportError = error.message;
      state.reportLoading = false;
      render();
      return;
    }
    state.reportLoading = false;
    // 生成完成后必须刷新页面，否则无 key 时页面会一直停留在加载态
    render();
    return;
  }

  // 仅在无 AI 结果且未失败时自动生成；失败后由用户手动重试，避免无限重试循环
  if (cache && !cache.report.ai && !cache.report.aiLoading && !cache.report.aiError) {
    generateDailyAi(active);
  }
}

async function generateDailyAi(profile) {
  const cache = getDailyReportCache(profile);
  if (!cache || cache.report.aiLoading) return;
  const settings = getAiSettings();
  if (!settings.apiKey.trim()) return;

  cache.report.aiLoading = true;
  cache.report.aiError = "";
  saveDailyReportCache(profile, cache.report);
  render();
  try {
    const aiText = await callAiDailyReport(cache.report);
    const updated = getDailyReportCache(profile);
    if (updated) {
      updated.report.ai = { text: aiText, time: new Date().toISOString() };
      updated.report.aiLoading = false;
      updated.report.aiError = "";
      saveDailyReportCache(profile, updated.report);
    }
  } catch (error) {
    const updated = getDailyReportCache(profile);
    if (updated) {
      updated.report.aiLoading = false;
      updated.report.aiError = error.message;
      saveDailyReportCache(profile, updated.report);
    }
  }
  render();
}

function regenerateDailyAi() {
  const active = getActiveProfile();
  if (!active) return;
  const cache = getDailyReportCache(active);
  if (!cache) return;
  cache.report.ai = null;
  cache.report.aiError = "";
  saveDailyReportCache(active, cache.report);
  generateDailyAi(active);
}

function retryDailyReport() {
  const active = getActiveProfile();
  if (active) {
    localStorage.removeItem(`taibu:daily:${active.id}:${todayString()}`);
  }
  state.reportLoading = false;
  state.reportError = "";
  render();
}

function inputTypeFor(fieldKey, schema, toolName) {
  if (schema.type === "boolean") return "checkbox";
  if (schema.type === "number" || schema.type === "integer") return "number";
  if (fieldKey === "question") return "textarea";
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return "select";
  if (fieldKey === "transitDateTime" || fieldKey === "customDate") {
    return "datetime-local";
  }
  if (fieldKey === "targetDate" || fieldKey === "startDate" || fieldKey === "endDate" || fieldKey === "date") {
    if (fieldKey === "date" && (toolName === "liuyao" || toolName === "meihua")) {
      return "datetime-local";
    }
    return "date";
  }
  if (schema.type === "array" || schema.type === "object") return "textarea";
  return "text";
}

function defaultValueFor(fieldKey, schema) {
  if (schema.default !== undefined) return schema.default;
  const profile = getActiveProfile();
  if (profile) {
    const profileValue = profileToRequest(profile)[fieldKey];
    if (profileValue !== undefined) return profileValue;
  }
  if (fieldKey === "gender") return "male";
  if (fieldKey === "calendarType") return "solar";
  if (fieldKey === "timezone") return "Asia/Shanghai";
  if (fieldKey === "detailLevel") return "default";
  if (fieldKey === "birthYear") return 1990;
  if (fieldKey === "birthMonth") return 1;
  if (fieldKey === "birthDay") return 15;
  if (fieldKey === "birthHour") return 12;
  if (fieldKey === "birthMinute") return 0;
  if (fieldKey === "spreadType") return "three-card";
  if (fieldKey === "method") return "auto";
  if (fieldKey === "mode") return "day";
  if (fieldKey === "houseSystem") return "placidus";
  if (schema.type === "boolean") return false;
  return "";
}

function fieldPlaceholder(fieldKey, schema) {
  if (schema.type === "number") return "请输入数字";
  if (schema.type === "array") return fieldKey === "yongShenTargets" ? "例如：官鬼、妻财" : "数组格式";
  if (schema.type === "object") return "对象格式";
  if (fieldKey === "question") return "例如：近期事业是否适合调整？";
  return "";
}

function renderField(fieldKey, schema, toolName) {
  const type = inputTypeFor(fieldKey, schema, toolName);
  const value = defaultValueFor(fieldKey, schema);
  const label = LABELS[fieldKey] || fieldKey;
  const required = schema.required === true;
  const hint = schema.description
    ? `<p class="field-hint">${escapeHtml(translateHint(schema.description))}</p>`
    : "";
  const wide = fieldKey === "question" || fieldKey === "numbers" || fieldKey === "queries" || schema.type === "object";
  const className = `field ${wide ? "field-wide" : ""}`;

  let control = "";
  if (type === "checkbox") {
    control = `
      <div class="toggle-field">
        <label for="field-${fieldKey}">${escapeHtml(label)}</label>
        <input id="field-${fieldKey}" data-field="${fieldKey}" type="checkbox" ${value ? "checked" : ""} />
      </div>
    `;
  } else if (type === "select") {
    const options = schema.enum
      .map(
        (item) =>
          `<option value="${escapeHtml(item)}" ${String(value) === String(item) ? "selected" : ""}>${escapeHtml(
            ENUM_LABELS[String(item)] || item
          )}</option>`
      )
      .join("");
    control = `
      <label for="field-${fieldKey}">${escapeHtml(label)}${required ? " *" : ""}</label>
      <select id="field-${fieldKey}" data-field="${fieldKey}">${options}</select>
    `;
  } else if (type === "textarea") {
    control = `
      <label for="field-${fieldKey}">${escapeHtml(label)}${required ? " *" : ""}</label>
      <textarea id="field-${fieldKey}" data-field="${fieldKey}" placeholder="${escapeHtml(fieldPlaceholder(fieldKey, schema))}">${escapeHtml(
        typeof value === "object" ? JSON.stringify(value, null, 2) : value
      )}</textarea>
    `;
  } else if (type === "datetime-local" || type === "date") {
    const now = new Date();
    const fallback = type === "date"
      ? now.toISOString().slice(0, 10)
      : now.toISOString().slice(0, 16);
    control = `
      <label for="field-${fieldKey}">${escapeHtml(label)}${required ? " *" : ""}</label>
      <input id="field-${fieldKey}" data-field="${fieldKey}" type="${type}" value="${escapeHtml(value || fallback)}" />
    `;
  } else {
    const min = schema.minimum !== undefined ? ` min="${schema.minimum}"` : "";
    const max = schema.maximum !== undefined ? ` max="${schema.maximum}"` : "";
    const step = schema.type === "number" && schema.minimum === undefined ? ' step="any"' : "";
    control = `
      <label for="field-${fieldKey}">${escapeHtml(label)}${required ? " *" : ""}</label>
      <input id="field-${fieldKey}" data-field="${fieldKey}" type="${type}" value="${escapeHtml(value ?? "")}" placeholder="${escapeHtml(
        fieldPlaceholder(fieldKey, schema)
      )}" ${min}${max}${step} />
    `;
  }

  return `<div class="${className}">${control}${hint}</div>`;
}

function renderToolForm(toolName) {
  const tool = getToolDefinition(toolName);
  const meta = getToolMeta(toolName);
  const profiles = getProfiles();
  const active = getActiveProfile();

  if (!tool) {
    return renderShell(`<div class="error-box">未找到工具：${escapeHtml(toolName)}</div>`);
  }

  const properties = tool.inputSchema?.properties || {};
  const required = tool.inputSchema?.required || [];
  const fields = Object.entries(properties)
    .filter(([key]) => key !== "detailLevel")
    .map(([key, schema]) => {
      const normalizedSchema = { ...schema, required: required.includes(key) };
      return renderField(key, normalizedSchema, toolName);
    })
    .join("");

  const advancedFields = properties.detailLevel
    ? renderField("detailLevel", { ...properties.detailLevel, required: false }, toolName)
    : "";

  // 一键排盘：仅当工具以出生信息为主输入、且当前档案覆盖全部必填字段时启用
  const usesBirth = Boolean(properties.birthYear);
  const profileReq = active ? profileToRequest(active) : null;
  const quickReady = Boolean(
    usesBirth && active && profileReq && required.length > 0 &&
    required.every((key) => profileReq[key] !== undefined)
  );

  const quickCard = quickReady
    ? `
      <section class="panel quick-start-card">
        <div class="quick-start-info">
          <span class="quick-start-label">当前测算对象</span>
          <strong>${escapeHtml(profileSummary(active))}</strong>
        </div>
        <div class="quick-start-actions">
          <button class="primary-button" data-action="quick-start" data-tool="${escapeHtml(toolName)}">用我的信息排盘</button>
          <button class="secondary-button" data-action="reveal-form">为他人排盘</button>
        </div>
      </section>
    `
    : "";

  const saveRow = usesBirth
    ? `
      <div class="profile-save-row">
        <input id="profile-name" data-profile-name value="${escapeHtml(active?.name || "")}" placeholder="档案名称，例如：我自己" />
        <button type="button" class="secondary-button" data-action="save-profile">保存为档案</button>
      </div>
    `
    : "";

  return renderShell(
    `
      <button class="secondary-button" data-action="home">返回工具</button>
      <div class="section-heading">
        <div>
          <h1 class="page-heading">${escapeHtml(toolLabel(toolName))}</h1>
          <p class="page-subtitle">${escapeHtml(tool.description || "")}</p>
        </div>
        <span class="tool-icon" style="--card-tint:${meta.tint};--card-ink:${meta.ink}">${escapeHtml(meta.icon)}</span>
      </div>
      ${quickCard}
      <form class="${quickReady ? "form-panel panel is-hidden" : "form-panel panel"}" data-tool-form="${escapeHtml(toolName)}">
        <div class="form-grid">${fields}</div>
        <details class="details-box">
          <summary>高级设置</summary>
          <div class="form-grid" style="margin-top:10px">${advancedFields}</div>
        </details>
        ${saveRow}
        <div class="form-actions">
          <button type="button" class="secondary-button" data-action="home">取消</button>
          <button type="submit" class="primary-button">开始排盘</button>
        </div>
        <div class="error-box is-hidden" data-form-error></div>
      </form>
    `,
    "home"
  );
}

function revealToolForm() {
  const form = document.querySelector("[data-tool-form]");
  if (!form) return;
  form.classList.remove("is-hidden");
  // 为他人排盘：清空档案带入的出生资料，方便输入他人信息
  const birthFields = ["gender", "birthYear", "birthMonth", "birthDay", "birthHour", "birthMinute", "calendarType", "isLeapMonth", "birthPlace", "longitude", "latitude"];
  form.querySelectorAll("[data-field]").forEach((field) => {
    if (!birthFields.includes(field.dataset.field)) return;
    if (field.type === "checkbox") field.checked = false;
    else field.value = "";
  });
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function quickStartTool(toolName) {
  const active = getActiveProfile();
  const form = document.querySelector(`[data-tool-form="${toolName}"]`);
  if (!active || !form) return;
  const button = document.querySelector(`[data-action="quick-start"][data-tool="${toolName}"]`);
  if (button) {
    button.disabled = true;
    button.textContent = "计算中...";
  }
  applyProfileToForm(active);
  const tool = getToolDefinition(toolName);
  const request = collectFormValues(form);
  const required = tool.inputSchema?.required || [];
  const missing = required.filter((key) => {
    const val = request[key];
    return val === undefined || val === null || val === "";
  });
  if (missing.length) {
    form.classList.remove("is-hidden");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    if (button) {
      button.disabled = false;
      button.textContent = "用我的信息排盘";
    }
    return;
  }
  try {
    await submitTool(toolName, form);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "用我的信息排盘";
    }
  }
}

function collectFormValues(form) {
  const values = {};
  for (const element of form.querySelectorAll("[data-field]")) {
    const key = element.dataset.field;
    if (element.type === "checkbox") {
      values[key] = element.checked;
      continue;
    }
    if (element.type === "number") {
      const raw = element.value.trim();
      if (raw !== "") values[key] = Number(raw);
      continue;
    }
    if (key === "yongShenTargets" && element.value.trim()) {
      const raw = element.value.trim();
      try {
        const parsed = JSON.parse(raw);
        values[key] = Array.isArray(parsed) ? parsed : [raw];
      } catch {
        values[key] = raw.split(/[,，\s]+/).filter(Boolean);
      }
      continue;
    }
    if (element.tagName === "TEXTAREA" && element.value.trim() && (key === "numbers" || key === "queries" || key === "replay" || key === "participants")) {
      try {
        values[key] = JSON.parse(element.value);
      } catch {
        values[key] = element.value.split(/[,，\s]+/).filter(Boolean);
      }
      continue;
    }
    if (element.value.trim() !== "") values[key] = element.value.trim();
  }
  return values;
}

async function submitTool(toolName, form) {
  const errorBox = form.querySelector("[data-form-error]");
  errorBox.classList.add("is-hidden");
  errorBox.textContent = "";

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "计算中...";

  const request = collectFormValues(form);
  try {
    const data = await apiRequest(`/api/tool/${encodeURIComponent(toolName)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    saveHistory(toolName, request, data);
    window.location.hash = `#/result/${encodeURIComponent(toolName)}`;
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove("is-hidden");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "开始排盘";
  }
}

function renderResult(toolName) {
  const stored = localStorage.getItem(`taibu:last:${toolName}`);
  if (!stored) {
    return renderShell(
      `
        <button class="secondary-button" data-action="home">返回工具</button>
        <div class="empty-box panel" style="margin-top:18px">
          <div>
            <p>还没有该工具的排盘结果。</p>
            <button class="primary-button" data-action="tool" data-tool="${escapeHtml(toolName)}">重新排盘</button>
          </div>
        </div>
      `
    );
  }

  let item;
  try {
    item = JSON.parse(stored);
  } catch {
    item = null;
  }

  if (!item) {
    return renderShell(`<div class="error-box">历史数据无法读取。</div>`);
  }

  const text = item.response?.text || "";
  const structured = item.response?.structured || null;
  const tool = getToolDefinition(toolName);

  return renderShell(
    `
      <div class="result-toolbar">
        <button class="secondary-button" data-action="tool" data-tool="${escapeHtml(toolName)}">重新排盘</button>
        <button class="secondary-button" data-action="copy">复制文本</button>
        <button class="secondary-button" data-action="download">下载报告</button>
        <button class="secondary-button" data-action="history">历史记录</button>
      </div>
      <div class="section-heading">
        <div>
          <h1 class="page-heading">${escapeHtml(toolLabel(toolName))}结果</h1>
          <p class="page-subtitle">${escapeHtml(formatTime(item.time) || (tool?.description || ""))}</p>
        </div>
      </div>
      <section class="panel result-panel">
        <div class="result-text markdown-render">${renderMarkdown(text)}</div>
        <pre class="is-hidden" data-copy-source>${escapeHtml(text)}</pre>
      </section>
      ${renderAiSection(toolName, item)}
      ${
        structured
          ? `
          <details class="details-box panel" style="padding:14px">
            <summary>查看结构化数据</summary>
            <pre class="json-text">${escapeHtml(JSON.stringify(structured, null, 2))}</pre>
          </details>
        `
          : ""
      }
      <p class="disclaimer">本工具仅供传统文化研究与娱乐参考，不构成任何决策建议。</p>
    `
  );
}

function renderAiSection(toolName, item) {
  const settings = getAiSettings();
  const hasKey = Boolean(settings.apiKey);
  const chat = getChatMessages(item);
  const chatHtml = chat
    .map(
      (message, index) => `
        <div class="chat-message ${message.role === "user" ? "user" : "assistant"}">
          <div class="chat-message-label">${message.role === "user" ? "你" : "太卜"}</div>
          <pre>${escapeHtml(message.content)}</pre>
        </div>
      `
    )
    .join("");

  const body = hasKey
    ? `
      <div class="form-actions">
        <button class="primary-button" data-action="ai-generate">AI辅助理解</button>
      </div>
      <div class="error-box is-hidden" data-ai-error></div>
      ${
        chat.length
          ? `
          <div class="chat-thread">${chatHtml}</div>
          <div class="chat-actions">
            <button class="secondary-button" data-action="ai-copy">复制对话</button>
            <button class="secondary-button" data-action="ai-clear-chat">清空对话</button>
          </div>
        `
          : ""
      }
      <div class="chat-input-row">
        <input data-chat-input placeholder="继续追问，例如：今年适合换工作吗？" />
        <button class="primary-button" data-action="ai-send">发送</button>
      </div>
    `
    : `
      <div class="ai-setup-hint">
        <p>尚未配置模型，配置后可用 AI 辅助理解排盘结果。</p>
        <button class="primary-button" data-action="ai-settings">前往模型设置</button>
      </div>
    `;

  return `
    <section class="panel result-panel ai-panel">
      <div class="section-heading">
        <div>
          <h2>智能对话</h2>
          <p class="page-subtitle">密钥只保存在本机，不会写入 APK 文件或发送到服务器。</p>
        </div>
      </div>
      ${body}
    </section>
  `;
}

function renderHistory() {
  const history = getHistory();
  const items = history.length
    ? history
        .map(
          (item, index) => `
            <button class="history-item" data-action="open-history" data-index="${index}">
              <span>
                <strong>${escapeHtml(toolLabel(item.tool))}</strong>
                <span>${escapeHtml(formatTime(item.time))}</span>
              </span>
              <span>打开</span>
            </button>
          `
        )
        .join("")
    : `<div class="empty-box panel"><div><p>暂无历史记录。</p><button class="primary-button" data-action="home">去选择工具</button></div></div>`;

  return renderShell(
    `
      <h1 class="page-heading">历史记录</h1>
      <p class="page-subtitle">记录仅保存在当前浏览器本地。</p>
      <div class="history-list">${items}</div>
    `,
    "history"
  );
}

function exportAllData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("taibu:")) {
      data[key] = localStorage.getItem(key);
    }
  }
  const payload = JSON.stringify(
    { app: "taibu-paipan", version: 1, exportedAt: new Date().toISOString(), data },
    null,
    2
  );
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `taibu-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return Object.keys(data).length;
}

function importAllData(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("文件不是有效的 JSON");
  }
  if (!parsed || parsed.app !== "taibu-paipan" || !parsed.data || typeof parsed.data !== "object") {
    throw new Error("不是太卜排盘的备份文件");
  }
  let count = 0;
  for (const [key, value] of Object.entries(parsed.data)) {
    if (key && key.startsWith("taibu:") && typeof value === "string") {
      localStorage.setItem(key, value);
      count++;
    }
  }
  return count;
}

function showBackupStatus(message, ok = true) {
  const el = app.querySelector("[data-backup-status]");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("is-hidden", false);
  el.classList.toggle("backup-status-ok", ok);
  el.classList.toggle("backup-status-error", !ok);
}

function renderProfiles() {
  const profiles = getProfiles();
  const active = getActiveProfile();
  const items = profiles.length
    ? profiles
        .map((profile) => {
          const isActive = active?.id === profile.id;
          return `
            <div class="panel profile-list-item">
              <div>
                <strong>${escapeHtml(profile.name)}</strong>
                <p>${escapeHtml(profileSummary(profile))}</p>
                <span>${isActive ? "当前测算对象" : "未启用"}</span>
              </div>
              <div class="profile-list-actions">
                <button class="secondary-button" data-action="set-profile" data-profile-id="${escapeHtml(
                  profile.id
                )}">${isActive ? "继续使用" : "设为当前"}</button>
                <button class="secondary-button" data-action="delete-profile" data-profile-id="${escapeHtml(
                  profile.id
                )}">删除</button>
              </div>
            </div>
          `;
        })
        .join("")
    : `<div class="empty-box panel"><div><p>还没有保存档案。</p><button class="primary-button" data-action="home">返回选择工具</button></div></div>`;

  return renderShell(
    `
      <h1 class="page-heading">命主档案</h1>
      <p class="page-subtitle">档案只保存在当前浏览器本地，选择后排盘表单会自动带入资料。</p>
      <div class="history-list">${items}</div>
      <section class="panel backup-panel">
        <h2>数据备份</h2>
        <p>导出全部档案、历史记录与模型密钥设置，或从备份文件恢复。建议定期备份，防止清除浏览器数据导致丢失。</p>
        <div class="backup-actions">
          <button class="secondary-button" data-action="export-data">导出数据</button>
          <button class="secondary-button" data-action="import-data">导入数据</button>
          <input type="file" accept="application/json,.json" data-import-file class="is-hidden" />
        </div>
        <p class="backup-status is-hidden" data-backup-status></p>
      </section>
    `,
    "profiles"
  );
}

function renderAiSettingsPage() {
  const settings = getAiSettings();
  const providerOptions = Object.entries(AI_PROVIDERS)
    .map(
      ([key, config]) =>
        `<option value="${escapeHtml(key)}" ${settings.provider === key ? "selected" : ""}>${escapeHtml(
          config.label
        )}</option>`
    )
    .join("");
  const current = AI_PROVIDERS[settings.provider];

  return renderShell(
    `
      <h1 class="page-heading">模型设置</h1>
      <p class="page-subtitle">密钥只保存在本机，不会写入 APK 文件或发送到服务器。</p>
      <form class="form-panel panel" data-ai-settings-form>
        <div class="form-grid">
          <div class="field">
            <label for="ai-provider">选择模型</label>
            <select id="ai-provider" data-ai-provider>${providerOptions}</select>
            <p class="field-hint" data-ai-base-hint>接口：${escapeHtml(current.baseUrl)} · 模型：${escapeHtml(current.model)}</p>
          </div>
          <div class="field">
            <label for="ai-key">接口密钥</label>
            <input id="ai-key" data-ai-key type="password" value="${escapeHtml(settings.apiKey)}" placeholder="sk-..." />
            <p class="field-hint">密钥只保存在本机，不会随 APK 传播。</p>
          </div>
        </div>
        <div class="form-actions">
          <button class="secondary-button" type="button" data-action="home">返回首页</button>
          <button class="primary-button" type="submit">保存设置</button>
        </div>
        <div class="error-box is-hidden" data-ai-settings-error></div>
      </form>
    `,
    "ai"
  );
}

function saveAiSettingsPageFromPage(form) {
  const provider = form.querySelector("[data-ai-provider]")?.value || "minimax";
  const apiKey = form.querySelector("[data-ai-key]")?.value || "";
  const config = AI_PROVIDERS[provider] || AI_PROVIDERS.minimax;
  saveAiSettings({ provider, apiKey, model: config.model, baseUrl: config.baseUrl });
  render();
}

async function runAiChat(userText) {
  const { segments } = parseHash();
  const toolName = segments[1] ? decodeURIComponent(segments[1]) : "";
  const stored = localStorage.getItem(`taibu:last:${toolName}`);
  if (!stored) return;

  let item;
  try {
    item = JSON.parse(stored);
  } catch {
    return;
  }

  const errorBox = document.querySelector("[data-ai-error]");
  const buttons = [
    document.querySelector('[data-action="ai-generate"]'),
    document.querySelector('[data-action="ai-send"]'),
  ].filter(Boolean);
  errorBox?.classList.add("is-hidden");
  if (errorBox) errorBox.textContent = "";
  buttons.forEach((button) => {
    button.disabled = true;
    button.textContent = button.dataset.action === "ai-send" ? "发送中..." : "生成中...";
  });

  try {
    const aiText = await callAiChat(toolName, item, userText);
    const chat = [...getChatMessages(item), { role: "user", content: userText }, { role: "assistant", content: aiText }];
    saveChat(toolName, chat);
    render();
  } catch (error) {
    if (errorBox) {
      errorBox.textContent = error.message;
      errorBox.classList.remove("is-hidden");
    }
  } finally {
    buttons.forEach((button) => {
      button.disabled = false;
      button.textContent = button.dataset.action === "ai-send" ? "发送" : "生成解读";
    });
  }
}

async function generateAiReadingFromPage() {
  await runAiChat("请结合我的档案和排盘结果，给出完整解读。");
}

async function sendAiChatFromPage() {
  const input = document.querySelector("[data-chat-input]");
  const text = input?.value.trim();
  if (!text) return;
  input.value = "";
  await runAiChat(text);
}

function clearAiChat() {
  const { segments } = parseHash();
  const toolName = segments[1] ? decodeURIComponent(segments[1]) : "";
  const stored = localStorage.getItem(`taibu:last:${toolName}`);
  if (!stored) return;
  try {
    const item = JSON.parse(stored);
    delete item.chat;
    delete item.ai;
    localStorage.setItem(`taibu:last:${toolName}`, JSON.stringify(item));
    render();
  } catch {
    // 忽略损坏的历史记录。
  }
}

async function copyAiReading() {
  const messages = Array.from(document.querySelectorAll(".chat-message pre")).map((node) => node.textContent);
  if (!messages.length) return;
  const text = messages.join("\n\n");
  try {
    await navigator.clipboard?.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

async function copyText() {
  const source = document.querySelector("[data-copy-source]");
  if (!source) return;
  const text = source.textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function downloadText() {
  const source = document.querySelector("[data-copy-source]");
  if (!source) return;
  const blob = new Blob([source.textContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "太卜排盘报告.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function render() {
  const { segments } = parseHash();
  const first = segments[0] || "";
  const toolName = segments[1] ? decodeURIComponent(segments[1]) : "";

  let content;
  if (first === "tool" && toolName) {
    content = renderToolForm(toolName);
  } else if (first === "result" && toolName) {
    content = renderResult(toolName);
  } else if (first === "history") {
    content = renderHistory();
  } else if (first === "profiles") {
    content = renderProfiles();
  } else if (first === "report") {
    content = renderDailyReport();
  } else if (first === "ai") {
    content = renderAiSettingsPage();
  } else {
    content = renderHome();
  }

  app.innerHTML = content;
  bindEvents();
  if (first === "tool" && toolName) {
    // 直接展示的表单（非一键排盘）自动带入当前档案资料
    const form = app.querySelector("[data-tool-form]");
    if (form && !form.classList.contains("is-hidden")) {
      applyProfileToForm(getActiveProfile());
    }
  }
  if (first === "report") {
    loadDailyReportIfNeeded();
  }
}

function bindEvents() {
  app.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      const action = element.dataset.action;
      const tool = element.dataset.tool || "";

      if (action === "home") {
        window.location.hash = "#/";
      } else if (action === "history") {
        window.location.hash = "#/history";
      } else if (action === "profiles") {
        window.location.hash = "#/profiles";
      } else if (action === "ai-settings") {
        window.location.hash = "#/ai";
      } else if (action === "report") {
        window.location.hash = "#/report";
      } else if (action === "retry-report") {
        retryDailyReport();
      } else if (action === "ai-report-regenerate") {
        regenerateDailyAi();
      } else if (action === "tool") {
        window.location.hash = `#/tool/${encodeURIComponent(tool)}`;
      } else if (action === "quick-start") {
        quickStartTool(element.dataset.tool);
      } else if (action === "reveal-form") {
        revealToolForm();
      } else if (action === "copy") {
        copyText();
      } else if (action === "download") {
        downloadText();
      } else if (action === "ai-generate") {
        generateAiReadingFromPage();
      } else if (action === "ai-copy") {
        copyAiReading();
      } else if (action === "ai-send") {
        sendAiChatFromPage();
      } else if (action === "ai-clear-chat") {
        clearAiChat();
      } else if (action === "save-profile") {
        saveProfileFromPage();
      } else if (action === "set-profile") {
        setActiveProfile(element.dataset.profileId);
        render();
      } else if (action === "delete-profile") {
        const profileIdToDelete = element.dataset.profileId;
        const profile = getProfiles().find((item) => item.id === profileIdToDelete);
        if (profile && window.confirm(`确定删除档案“${profile.name}”吗？`)) {
          const profiles = getProfiles().filter((item) => item.id !== profileIdToDelete);
          saveProfiles(profiles);
          if (getActiveProfile()?.id === profileIdToDelete) {
            localStorage.removeItem(ACTIVE_PROFILE_KEY);
          }
          render();
        }
      } else if (action === "open-history") {
        const history = getHistory();
        const item = history[Number(element.dataset.index)];
        if (item) {
          localStorage.setItem(`taibu:last:${item.tool}`, JSON.stringify(item));
          window.location.hash = `#/result/${encodeURIComponent(item.tool)}`;
        }
      } else if (action === "export-data") {
        const count = exportAllData();
        showBackupStatus(`已导出 ${count} 项数据，请妥善保存备份文件。`);
      } else if (action === "import-data") {
        app.querySelector("[data-import-file]")?.click();
      }
    });
  });

  const importFile = app.querySelector("[data-import-file]");
  if (importFile) {
    importFile.addEventListener("change", async () => {
      const file = importFile.files && importFile.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const count = importAllData(text);
        render();
        showBackupStatus(`已恢复 ${count} 项数据。`);
      } catch (error) {
        showBackupStatus(error.message, false);
      } finally {
        importFile.value = "";
      }
    });
  }

  app.querySelectorAll("[data-tool]").forEach((element) => {
    if (element.dataset.action) return;
    element.addEventListener("click", () => {
      const tool = element.dataset.tool;
      window.location.hash = `#/tool/${encodeURIComponent(tool)}`;
    });
  });

  app.querySelectorAll("[data-tool-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const toolName = form.dataset.toolForm;
      submitTool(toolName, form);
    });
  });

  app.querySelectorAll("[data-ai-settings-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveAiSettingsPageFromPage(form);
    });
  });

  app.querySelectorAll("[data-ai-provider]").forEach((select) => {
    select.addEventListener("change", () => {
      const config = AI_PROVIDERS[select.value];
      const hint = select.parentElement?.querySelector("[data-ai-base-hint]");
      if (hint && config) {
        hint.textContent = `接口：${config.baseUrl} · 模型：${config.model}`;
      }
    });
  });

  app.querySelectorAll("[data-chat-input]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendAiChatFromPage();
      }
    });
  });
}

async function init() {
  try {
    const data = await apiRequest("/api/tools");
    state.tools = data.tools;
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
    render();
  }

  window.addEventListener("hashchange", render);
  // APK（taibu.local 虚拟域）内不注册 Service Worker，避免 WebView 缓存干扰
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && location.hostname !== "taibu.local") {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
  initUpdateCheck();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    const { segments } = parseHash();
    if (["report", "result", "tool", "history", "profiles", "ai"].includes(segments[0] || "")) {
      window.location.hash = "#/";
    }
  });
}

// 应用内自更新（仅 APK 环境生效，浏览器环境自动跳过）
function initUpdateCheck() {
  if (!window.AndroidBridge) return;
  window.__onUpdateCheck = (info) => {
    try {
      const data = typeof info === "string" ? JSON.parse(info) : info;
      if (!data || !data.versionCode) return;
      const current = window.AndroidBridge.getVersionCode();
      if (data.versionCode > current) {
        const version = data.versionName ? `v${data.versionName}` : `v${data.versionCode}`;
        const notes = data.notes || "修复了一些问题，建议更新。";
        if (window.confirm(`发现新版本 ${version}\n\n${notes}\n\n是否立即下载并安装？`)) {
          window.AndroidBridge.downloadAndInstall(data.url);
        }
      }
    } catch (error) {
      // 更新检查失败不打扰用户。
    }
  };
  try {
    window.AndroidBridge.checkForUpdate();
  } catch (error) {
    // 忽略。
  }
}

init();
