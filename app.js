import { runAgent, toOpenAiTools } from "./agent.js";

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

// 工具表单字段分组：提升密集表单的可扫描性
const FIELD_GROUPS = [
  { key: "birth", label: "出生时间", fields: ["birthYear", "birthMonth", "birthDay", "birthHour", "gender", "calendarType", "isLeapMonth"] },
  { key: "place", label: "出生地点", fields: ["birthPlace", "longitude", "latitude"] },
  { key: "transit", label: "流运与问题", fields: ["transitTime", "question", "houseSystem", "spreadType", "method", "mode", "numbers", "queries", "yongShenTargets"] },
];

// 收进「高级设置」的可选字段：平时不占版面，需要精确输入时再展开
const ADVANCED_FIELDS = ["birthMinute", "timezone", "detailLevel"];

// 十二时辰：value 取该时辰的中间整点（子时记 0 点），引擎据此推时辰
const SHICHEN_OPTIONS = [
  { hour: 0, label: "子时", range: "23:00–01:00" },
  { hour: 2, label: "丑时", range: "01:00–03:00" },
  { hour: 4, label: "寅时", range: "03:00–05:00" },
  { hour: 6, label: "卯时", range: "05:00–07:00" },
  { hour: 8, label: "辰时", range: "07:00–09:00" },
  { hour: 10, label: "巳时", range: "09:00–11:00" },
  { hour: 12, label: "午时", range: "11:00–13:00" },
  { hour: 14, label: "未时", range: "13:00–15:00" },
  { hour: 16, label: "申时", range: "15:00–17:00" },
  { hour: 18, label: "酉时", range: "17:00–19:00" },
  { hour: 20, label: "戌时", range: "19:00–21:00" },
  { hour: 22, label: "亥时", range: "21:00–23:00" },
];

// 任意小时 → 所属时辰序号（0=子时）
function shichenIndexForHour(hour) {
  const h = ((Number(hour) % 24) + 24) % 24;
  return Math.floor(((h + 1) % 24) / 2);
}

// 出生时辰下拉：把"填 0-23 的数字"换成"选十二时辰"
function renderShichenField(fieldKey, value) {
  const label = fieldKey === "birthHour" ? "出生时辰" : LABELS[fieldKey] || fieldKey;
  const raw = value === "" || value === undefined || value === null ? 12 : Number(value);
  const idx = shichenIndexForHour(Number.isFinite(raw) ? raw : 12);
  const options = SHICHEN_OPTIONS.map(
    (item, i) => `<option value="${item.hour}" ${i === idx ? "selected" : ""}>${item.label}（${item.range}）</option>`
  ).join("");
  return `
    <div class="field">
      <label for="field-${fieldKey}">${escapeHtml(label)}</label>
      <select id="field-${fieldKey}" data-field="${fieldKey}" class="shichen-select">${options}</select>
      <p class="field-hint">记不清准确钟点，选大概时段即可。</p>
    </div>
  `;
}

// 表单分组序号（古籍卷目风格；用大写数字避免"一"被误读为折叠图标）
const GROUP_NUMERALS = ["壹", "贰", "叁", "肆", "伍"];

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
const DEVICE_ID_KEY = "taibu:device-id";
const RELAY_QUOTA_KEY = "taibu:relay-quota";

// 中转服务地址：部署好 relay/ 里的服务后填这里（部署方法见 relay/README.md）。
// 留空则不启用「免费体验」，新用户默认进入本地解读模式。
// 必须是 HTTPS，否则网页版会被浏览器按混合内容拦截。
const RELAY_BASE_URL = "";

// 免费体验走的模型：必须是中转服务 ALLOWED_MODELS 白名单里的名字
const RELAY_MODEL = "deepseek-chat";

const AI_PROVIDERS = {
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-flash",
    models: [
      { model: "deepseek-flash", label: "DeepSeek V4.1 Flash" },
      { model: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
    ],
  },
  mimo: {
    label: "小米 MiMo",
    baseUrl: "https://api.xiaomimimo.com/v1",
    model: "mimo-v2.6-flash",
    models: [
      { model: "mimo-v2.6-flash", label: "MiMo V2.6 Flash" },
      { model: "mimo-v2.6-pro", label: "MiMo V2.6 Pro（旗舰）" },
      { model: "mimo-v2.6-pro-ultraspeed", label: "MiMo V2.6 Pro 超高速" },
    ],
  },
};

// 免费体验：服务端持有密钥，客户端只带设备标识，无需配置即可用
if (RELAY_BASE_URL) {
  AI_PROVIDERS.relay = {
    label: "免费体验",
    baseUrl: RELAY_BASE_URL.replace(/\/+$/, ""),
    model: RELAY_MODEL,
    models: [{ model: RELAY_MODEL, label: "免费体验（赠送次数）" }],
    relay: true,
  };
}

// 下拉框顺序：能零配置的排最前
const AI_PROVIDER_ORDER = RELAY_BASE_URL ? ["relay", "deepseek", "mimo"] : ["deepseek", "mimo"];

const state = {
  tools: [],
  loading: true,
  error: "",
  reportLoading: false,
  reportError: "",
};

// 对话主界面：会话记录与 Agent 运行状态
const CHAT_KEY = "taibu:chat";
const CHAT_INDEX_KEY = "taibu:chats";
const CHAT_ACTIVE_KEY = "taibu:chat:active";
const CHAT_SESSION_PREFIX = "taibu:chatlog:";
const CHAT_LOG_LIMIT = 80;
const CHAT_TITLE_LIMIT = 18;
const CHAT_HISTORY_LIMIT = 12;
let chatBusy = false;

// 底部 / 顶部导航（对话为主入口，工具降为次级入口列表）
const NAV_ITEMS = [
  { id: "chat", action: "chat", label: "对话", icon: "话" },
  { id: "tools", action: "tools", label: "工具", icon: "算" },
  { id: "mine", action: "ai-settings", label: "我的", icon: "我" },
];

// 品牌标识：圭表日影（竖杆 + 地平线 + 向右日影），纯几何、无汉字
const BRAND_MARK = `<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><line x1="10" y1="47" x2="54" y2="47" stroke="currentColor" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/><line x1="25" y1="13" x2="25" y2="47" stroke="currentColor" stroke-width="4.6" stroke-linecap="round"/><line x1="25" y1="47" x2="50" y2="47" stroke="currentColor" stroke-opacity="0.78" stroke-width="6.6" stroke-linecap="round"/></svg>`;

// 工具次级入口分组
const TOOL_GROUPS = [
  { key: "chart", label: "命盘", tools: ["bazi", "bazi_dayun", "bazi_pillars_resolve", "ziwei", "ziwei_horoscope", "ziwei_flying_star", "astrology"] },
  { key: "divine", label: "占卜", tools: ["liuyao", "meihua", "qimen", "daliuren", "xiaoliuren", "tarot", "taiyi"] },
  { key: "calendar", label: "历法", tools: ["almanac"] },
];

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
  // 0 点是合法的子时，不能用 || 兜底
  const pickNumber = (value, fallback) => {
    if (value === undefined || value === null || value === "") return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    id: existing?.id || profileId(),
    name: name.trim() || existing?.name || "未命名档案",
    gender: request.gender || "male",
    birthYear: pickNumber(request.birthYear, 1990),
    birthMonth: pickNumber(request.birthMonth, 1),
    birthDay: pickNumber(request.birthDay, 15),
    birthHour: pickNumber(request.birthHour, 12),
    birthMinute: pickNumber(request.birthMinute, 0),
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

// 档案卡用的细节行（不带姓名，附上时辰与出生地）
function profileDetail(profile) {
  if (!profile) return "";
  const gender = profile.gender === "female" ? "女" : "男";
  const calendar = profile.calendarType === "lunar" ? "农历" : "公历";
  const time = SHICHEN_OPTIONS[shichenIndexForHour(profile.birthHour ?? 12)].label;
  const place = profile.birthPlace ? ` · ${profile.birthPlace}` : "";
  return `${gender} · ${calendar} ${profile.birthYear}年${profile.birthMonth}月${profile.birthDay}日 ${time}${place}`;
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
      } else if (key === "birthHour") {
        // 时辰下拉只认十二个整点，把任意小时归一到所属时辰
        field.value = String(SHICHEN_OPTIONS[shichenIndexForHour(value ?? 12)].hour);
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

// 没有任何保存记录时（新用户）默认落到「免费体验」，实现零配置可用
function defaultProviderKey() {
  return AI_PROVIDERS.relay ? "relay" : "deepseek";
}

function getAiSettings() {
  const fallbackKey = defaultProviderKey();
  const fallback = {
    provider: fallbackKey,
    apiKey: "",
    model: AI_PROVIDERS[fallbackKey].model,
    baseUrl: AI_PROVIDERS[fallbackKey].baseUrl,
  };
  try {
    const saved = JSON.parse(localStorage.getItem(AI_SETTINGS_KEY) || "{}");
    const valid = Boolean(AI_PROVIDERS[saved.provider]);
    const provider = valid ? saved.provider : fallback.provider;
    return {
      provider,
      apiKey: saved.apiKey || "",
      model: valid ? (saved.model || AI_PROVIDERS[provider].model || "") : AI_PROVIDERS[provider].model,
      baseUrl: valid ? (saved.baseUrl || AI_PROVIDERS[provider].baseUrl || "") : AI_PROVIDERS[provider].baseUrl,
    };
  } catch {
    return fallback;
  }
}

function saveAiSettings(settings) {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
}

// ===== 免费体验（中转服务）=====

function isRelayProvider(settings) {
  return Boolean(AI_PROVIDERS[(settings || getAiSettings()).provider]?.relay);
}

// 设备标识：中转服务靠它发放免费次数。只存本机，不含任何个人信息。
function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (id && id.length >= 8) return id;
  const rand = window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  id = rand;
  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

function getRelayQuota() {
  try {
    const saved = JSON.parse(localStorage.getItem(RELAY_QUOTA_KEY) || "{}");
    return {
      remaining: Number.isFinite(saved.remaining) ? saved.remaining : null,
      limit: Number.isFinite(saved.limit) ? saved.limit : null,
      exhausted: Boolean(saved.exhausted),
      checkedAt: saved.checkedAt || 0,
    };
  } catch {
    return { remaining: null, limit: null, exhausted: false, checkedAt: 0 };
  }
}

function saveRelayQuota(patch) {
  const next = { ...getRelayQuota(), ...patch, checkedAt: Date.now() };
  localStorage.setItem(RELAY_QUOTA_KEY, JSON.stringify(next));
  return next;
}

// 中转额度用尽 / 本月熔断时，客户端要退回本地解读
const RELAY_BLOCK_CODES = new Set(["QUOTA_EXHAUSTED", "IP_QUOTA_EXHAUSTED", "BUDGET_EXHAUSTED"]);

function isRelayBlockError(error) {
  if (!error) return false;
  if (RELAY_BLOCK_CODES.has(error.code)) return true;
  return error.status === 429 || error.status === 503;
}

function relayQuotaText() {
  const quota = getRelayQuota();
  if (quota.exhausted) return "免费次数已用完";
  if (quota.remaining === null) return "剩余次数未知";
  return `剩余 ${quota.remaining} 次免费体验`;
}

// 是否走模型：填了自己的密钥，或选了免费体验且额度还没用完
function aiEnabled() {
  const settings = getAiSettings();
  if (isRelayProvider(settings)) return !getRelayQuota().exhausted;
  return Boolean(settings.apiKey.trim());
}

// 请求头：中转模式带设备标识与轮次 ID，自带密钥模式带 Authorization
function aiRequestHeaders(settings, turnId = "") {
  const headers = { "Content-Type": "application/json" };
  if (isRelayProvider(settings)) {
    headers["X-Device-Id"] = getDeviceId();
    if (turnId) headers["X-Turn-Id"] = turnId;
  } else {
    headers.Authorization = `Bearer ${settings.apiKey.trim()}`;
  }
  return headers;
}

// 从响应头读回剩余次数，供界面展示
function captureRelayQuota(response, settings) {
  if (!isRelayProvider(settings)) return;
  const remaining = response.headers.get("x-relay-remaining");
  if (remaining === null) return;
  const value = Number(remaining);
  if (!Number.isFinite(value)) return;
  saveRelayQuota({ remaining: value, exhausted: value <= 0 });
}

// 额度耗尽时把状态记下来，后续消息直接走本地解读
function markRelayExhausted() {
  saveRelayQuota({ remaining: 0, exhausted: true });
}

async function refreshRelayQuota() {
  if (!AI_PROVIDERS.relay) return null;
  try {
    const response = await fetch(`${AI_PROVIDERS.relay.baseUrl}/v1/relay/quota`, {
      headers: { "X-Device-Id": getDeviceId() },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return saveRelayQuota({
      remaining: Number(data.remaining) || 0,
      limit: Number(data.limit) || null,
      exhausted: (Number(data.remaining) || 0) <= 0,
    });
  } catch {
    // 网络不通时保持上一次的记录，不阻塞启动
    return null;
  }
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
  if (!aiEnabled()) {
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

  const url = `${baseUrl}/chat/completions`;
  const response = await fetch(url, {
    method: "POST",
    headers: aiRequestHeaders(settings),
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  captureRelayQuota(response, settings);

  if (!response.ok) {
    let message = `接口请求失败（${response.status}）`;
    let code = "";
    try {
      const data = await response.json();
      message = data.error?.message || data.message || message;
      code = data.error?.code || "";
    } catch {
      // 保留默认错误信息。
    }
    const error = new Error(message);
    error.status = response.status;
    error.code = code;
    throw error;
  }

  const data = await response.json();
  const content =
    data.choices?.[0]?.message?.content || data.reply || data.output_text || "";
  if (!content.trim()) {
    throw new Error("模型没有返回解读内容");
  }
  return content.trim();
}

// 流式请求：OpenAI 兼容（deepseek/mimo）统一由 onDelta 逐段回调。
async function streamAiReport(systemPrompt, userText, onDelta) {
  const settings = getAiSettings();
  if (!aiEnabled()) {
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
  const url = `${baseUrl}/chat/completions`;
  const resp = await fetch(url, {
    method: "POST",
    headers: aiRequestHeaders(settings),
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      temperature: 0.7,
      stream: true,
    }),
  });

  captureRelayQuota(resp, settings);

  if (!resp.ok) {
    let message = `接口请求失败（${resp.status}）`;
    let code = "";
    try {
      const data = await resp.json();
      message = data.error?.message || data.message || message;
      code = data.error?.code || "";
    } catch {
      // 保留默认错误信息。
    }
    const error = new Error(message);
    error.status = resp.status;
    error.code = code;
    throw error;
  }

  if (!resp.body || !resp.body.getReader) {
    // 个别网关不回传流（如 content-encoding 被改写），退回普通 JSON 解析
    const data = await resp.json();
    const content =
      data.choices?.[0]?.message?.content || data.reply || data.output_text || "";
    if (!content.trim()) throw new Error("模型没有返回解读内容");
    onDelta(content);
    return content.trim();
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
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
      try {
        const json = JSON.parse(payload);
        const delta =
          json.choices?.[0]?.delta?.content ||
          json.choices?.[0]?.delta?.text ||
          json.choices?.[0]?.text ||
          json.delta?.content ||
          json.output_text ||
          "";
        if (delta) {
          full += delta;
          onDelta(delta);
        }
      } catch {
        // 忽略无法解析的行（如 keep-alive）。
      }
    }
  }
  if (!full.trim()) {
    throw new Error("模型没有返回解读内容");
  }
  return full.trim();
}

// 本地规则校验：只保留一条「所述宜/忌是否在计算结果中」的硬核验，
// 替代原先耗时的二次 AI 调用。命中的保留，未命中的补一句免责标注。
function localValidateDailyText(data, draft) {
  const suitable = [...(data.宜 || [])].filter(Boolean).map(String);
  const avoid = [...(data.忌 || [])].filter(Boolean).map(String);

  let result = String(draft || "");
  result = result.replace(
    /^(\s*[-•])\s*(宜|忌)\s*[:：]?\s*([^\n]+)/gm,
    (whole, bullet, type, content) => {
      const item = content.trim().split(/[，,。；;（(]/)[0];
      const set = type === "宜" ? suitable : avoid;
      const hit = set.some((k) => k && item.includes(k));
      if (hit) return whole;
      return `${bullet} ${type} ${item}（此条为模型依五行/黄历的一般性说明，计算结果中未单列）`;
    }
  );
  return result.trim();
}

// ===== 对话解读本地核验 =====
// 与 localValidateDailyText 同思路：不额外调用 AI，用本地规则把解读里提到的术数专有名词
// 回查本次排盘结果原文（引擎输出的 JSON 文本），未出现的就地标注。
// 词表只收「无歧义」的专有名词：宫位一律带「宫」字（避免把「父母/夫妻」这类日常用语误判），
// 单字的干支与五行（金木水火土、病死衰）一律不收，因为它们在正常行文里太常见。
const CHART_TERMS = [
  // 十神
  "比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印",
  // 紫微十四主星
  "紫微", "天机", "太阳", "武曲", "天同", "廉贞", "天府", "太阴", "贪狼", "巨门", "天相", "天梁", "破军",
  // 六吉六煞（火星太像日常用语，未收）
  "左辅", "右弼", "文昌", "文曲", "天魁", "天钺", "禄存", "天马", "擎羊", "陀罗", "铃星", "地劫", "地空",
  // 四化
  "化禄", "化权", "化科", "化忌",
  // 五行局
  "水二局", "木三局", "金四局", "土五局", "火六局",
  // 十二宫（只收带「宫」的长写法）
  "命宫", "兄弟宫", "夫妻宫", "子女宫", "财帛宫", "疾厄宫", "迁移宫", "交友宫", "仆役宫",
  "官禄宫", "田宅宫", "福德宫", "父母宫",
  // 常见神煞
  "天乙贵人", "太极贵人", "天德贵人", "月德贵人", "天德合", "月德合", "国印贵人", "福星贵人", "文昌贵人",
  "将星", "华盖", "驿马", "咸池", "桃花", "红鸾", "天喜", "孤辰", "寡宿", "亡神", "劫煞", "灾煞", "天煞", "月煞", "年煞",
  "羊刃", "阳刃", "禄神", "金舆", "魁罡", "空亡", "旬空", "披头", "孤鸾煞", "童子煞", "十恶大败", "阴阳差错",
  "元辰", "六厄", "勾绞", "血刃", "血支", "流霞", "天罗", "地网", "四废", "岁破", "月破", "大耗", "小耗",
  "官符", "病符", "死符", "五鬼", "丧门", "吊客", "白虎", "贯索", "飞廉", "蜚廉", "指背", "攀鞍", "岁驿", "龙德", "岁建",
  // 紫微杂曜
  "三台", "八座", "恩光", "台辅", "封诰", "天贵", "天福", "天官", "天厨", "天刑", "天姚", "天巫", "天月",
  "天哭", "天虚", "天伤", "天使", "天才", "天寿", "龙池", "凤阁", "解神", "阴煞", "截路", "年解", "月德", "伏兵", "奏书",
  // 十二长生（多字部分）
  "长生", "沐浴", "冠带", "临官", "帝旺",
];

// 引擎输出是英文键名 + 中文值，模型会从键名推出「空亡/日主/四柱」这类说法，
// 这些词在 JSON 原文里并不出现，必须按键名补认，否则会误报。
const CHART_KEY_TERMS = [
  ["kongWang", "空亡"], ["kongZhi", "空亡"], ["xun", "旬"], ["dayMaster", "日主"],
  ["fourPillars", "四柱"], ["naYin", "纳音"], ["shenSha", "神煞"], ["hiddenStems", "藏干"],
  ["tenGod", "十神"], ["diShi", "地势"], ["qiType", "气"], ["mingGong", "命宫"], ["taiYuan", "胎元"],
  ["palaces", "宫位"], ["decadalList", "大限"], ["smallLimit", "小限"], ["mutagenSummary", "四化"],
  ["fiveElement", "五行局"], ["zodiac", "生肖"], ["sign", "星座"], ["soul", "命主"], ["body", "身主"],
  ["lifeMasterStar", "命主星"], ["bodyMasterStar", "身主星"], ["scholarStars", "博士星"],
  ["tianGanWuHe", "天干五合"], ["tianGanChongKe", "天干冲克"], ["diZhiBanHe", "地支半合"],
  ["diZhiSanHui", "地支三会"], ["relations", "刑冲合害"], ["douJun", "斗君"],
];

const CHART_TERM_LIST = [...new Set(CHART_TERMS)].sort((a, b) => b.length - a.length);

function buildVerifiedTerms(corpus) {
  const verified = new Set();
  for (const [key, term] of CHART_KEY_TERMS) {
    if (corpus.includes(key)) verified.add(term);
  }
  return verified;
}

function isTermVerified(term, corpus, verified) {
  if (corpus.includes(term)) return true;
  if (verified.has(term)) return true;
  // 宫位/星曜：引擎可能只输出短写法（「父母」而非「父母宫」），回退再查一次
  const stripped = term.replace(/[宫星]$/, "");
  return stripped !== term && stripped.length >= 2 && corpus.includes(stripped);
}

function findUnverifiedTerms(text, corpus, verified) {
  return CHART_TERM_LIST.filter((term) => text.includes(term) && !isTermVerified(term, corpus, verified));
}

// 本轮调了工具就用本轮结果；没调（追问场景）则回退到最近一次带排盘结果的历史，
// 避免拿不到盘面时把正确解读误判成编造。
function collectVerifyCorpus(trace) {
  const current = (trace || []).filter((item) => item.ok && item.text).map((item) => item.text);
  if (current.length) return current;
  const log = getChatLog();
  for (let i = log.length - 1; i >= 0; i -= 1) {
    const texts = (log[i].tools || []).filter((item) => item.ok && item.text).map((item) => item.text);
    if (texts.length) return texts;
  }
  return [];
}

function verifyChatReading(text, trace) {
  const body = String(text || "");
  if (!body.trim()) return body;
  const corpusParts = collectVerifyCorpus(trace);
  if (!corpusParts.length) return body;
  const corpus = corpusParts.join("\n");
  const verified = buildVerifiedTerms(corpus);

  // 优先精确标注：模型按模板写了「依据：…」，就在那一条后面就地说明
  let touched = false;
  const marked = body.replace(/(依据\s*[：:]\s*)([^\n]+)/g, (whole, prefix, segment) => {
    const bad = findUnverifiedTerms(segment, corpus, verified);
    if (!bad.length) return whole;
    touched = true;
    return `${prefix}${segment}（本地核验：其中「${bad.join("」「")}」未见于本次排盘结果，可能是模型的一般性推论）`;
  });
  if (touched) return marked;

  // 模型没按「依据：」格式写时，退化为全文检查 + 末尾统一提示
  const bad = findUnverifiedTerms(body, corpus, verified);
  if (!bad.length) return body;
  return `${body}\n\n本地核验：解读中提到的「${bad.join("」「")}」未见于本次排盘结果，可能是模型的一般性推论，请以排盘结果为准。`;
}

// ===== 本地解读兜底 =====
// 未配置模型时使用：全部内容直接取自引擎的计算结果，不做推测与补充，
// 因此不存在「编造盘面里没有的内容」的问题。渲染时即时计算，不落盘。
const LOCAL_DISCLAIMER =
  "本段解读由本地规则依据计算结果生成，未经 AI 润色，仅供传统文化研究与娱乐参考。";
const LOCAL_UPGRADE_HINT = "配置模型后可获得结合档案的逐条解读，并能就盘面继续追问。";

const WU_XING_COLORS = {
  金: "白、银、金",
  木: "绿、青",
  水: "黑、蓝",
  火: "红、紫",
  土: "黄、棕",
};

function hasAiKey() {
  return aiEnabled();
}

// 无模型能力时的引导块：区分「还没配过」和「免费次数用完」两种情况
function localReadingHintBlock() {
  const settings = getAiSettings();
  if (isRelayProvider(settings) && getRelayQuota().exhausted) {
    return `
      <div class="local-reading-hint">
        <p>免费体验次数已用完，当前为本地解读：内容全部取自计算结果。${LOCAL_UPGRADE_HINT}</p>
        <button class="primary-button" data-action="ai-settings">填写自己的密钥</button>
      </div>
    `;
  }
  return `
    <div class="local-reading-hint">
      <p>当前为本地解读：内容全部取自计算结果，不额外调用模型。${LOCAL_UPGRADE_HINT}</p>
      <button class="primary-button" data-action="ai-settings">配置模型</button>
    </div>
  `;
}

// 解读区副标题：说明这一段的解读来源
function aiModeSubtitle() {
  const settings = getAiSettings();
  if (isRelayProvider(settings)) {
    return getRelayQuota().exhausted
      ? "免费次数已用完，以下为本地解读。"
      : `免费体验中（${relayQuotaText()}），AI 严格依据上方计算结果生成。`;
  }
  return settings.apiKey.trim()
    ? "AI 严格依据上方计算结果生成，不编造未计算的内容。"
    : "本地解读严格依据上方计算结果生成，不编造未计算的内容。";
}

function joinOr(items, fallback = "—") {
  const list = (items || []).filter(Boolean).map(String);
  return list.length ? list.join("、") : fallback;
}

function bulletLines(lines, fallback = "- —") {
  const list = (lines || []).filter(Boolean);
  return list.length ? list.map((line) => `- ${line}`).join("\n") : fallback;
}

// 今日报告：6 节结构，与 AI 解读的格式约定保持一致
function buildLocalDailyReading(report) {
  const d = buildDailyAiData(report);
  const raw = extractAlmanacData(report.almanac);
  const wuXing = GAN_WU_XING[raw.dayMaster] || "";
  const starWuXing = d.日九星五行 || wuXing;
  const colors = WU_XING_COLORS[starWuXing] || "";
  const dirs = d.方位 || {};
  const luckyHours = d.吉时 || [];
  const luckText = String(d.值神 || "");
  const luckTone = luckText.includes("吉") ? "偏吉" : luckText.includes("凶") ? "偏凶" : "平和";

  const overview = [
    `今日为 ${d.日期}（${d.农历 || "农历未提供"}${d.生肖 ? `，${d.生肖}年` : ""}）。`,
    raw.dayMaster
      ? `您的日主为 ${raw.dayMaster}${wuXing ? `，属${wuXing}` : ""}，今日流日十神为「${d.流日十神 || "未计算"}」。`
      : "",
    d.值神 ? `值日天神为 ${d.值神}，今日基调${luckTone}。` : "",
    d.纳音 ? `当日纳音为 ${d.纳音}。` : "",
    `黄历所宜：${joinOr((d.宜 || []).slice(0, 5))}；所忌：${joinOr((d.忌 || []).slice(0, 5))}。`,
  ]
    .filter(Boolean)
    .join("");

  const yiLines = (d.宜 || []).map((item) => `${item}（依据：当日黄历宜神所宜）`);
  const jiLines = (d.忌 || []).map((item) => `${item}（依据：当日黄历忌神所忌）`);

  const hourLines = luckyHours.length
    ? luckyHours.map((hour) => `吉时 ${hour}（依据：当日十二时辰天神吉凶判定）`)
    : ["当日十二时辰中未出现吉时（依据：当日十二时辰天神吉凶判定）"];
  const dirLines = [
    ["财神", dirs.caiShen],
    ["喜神", dirs.xiShen],
    ["福神", dirs.fuShen],
    ["阳贵", dirs.yangGui],
    ["阴贵", dirs.yinGui],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}方位在${value}（依据：当日黄历方位）`);

  const outfit =
    starWuXing && colors
      ? [
          `今日${d.日九星五行 ? "日九星" : "日主"}五行属${starWuXing}，传统五行配色对应「${colors}」，可作为穿搭主色参考。${
            d.日九星颜色 ? `引擎标注的当日颜色为「${d.日九星颜色}」。` : ""
          }`,
          "",
          "五行配色属传统文化参考，不是确定预测。",
        ].join("\n")
      : "计算结果中未提供当日五行信息，暂无法给出配色参考。";

  const remind = bulletLines(
    [
      d.冲煞 ? `冲煞：${d.冲煞}（依据：当日黄历冲煞）` : "",
      (d.凶煞 || []).length ? `凶煞宜忌：${d.凶煞.join("、")}（依据：当日凶煞）` : "",
      (d.吉神 || []).length ? `吉神宜趋：${d.吉神.join("、")}（依据：当日吉神）` : "",
      d.彭祖百忌 ? `彭祖百忌：${d.彭祖百忌}（依据：当日彭祖百忌）` : "",
      d.日建 ? `值日：${d.日建}（依据：当日建除十二神）` : "",
    ],
    "- 当日计算结果中未列出额外的冲煞与禁忌。"
  );

  return [
    "## 今日概要",
    "",
    overview,
    "",
    "## 宜忌与行事",
    "",
    "**宜**",
    bulletLines(yiLines),
    "",
    "**忌**",
    bulletLines(jiLines),
    "",
    "## 吉时与方位",
    "",
    bulletLines([...hourLines, ...dirLines], "- 当日计算结果中未列出吉时与方位。"),
    "",
    "## 穿搭与颜色",
    "",
    outfit,
    "",
    "## 今日提醒",
    "",
    remind,
    "",
    "## 温馨提示",
    "",
    LOCAL_DISCLAIMER,
  ].join("\n");
}

// 工具结果：5 节结构。结构化数据是「中文区块名 → 对象/数组」，按区块逐个展开。
const LOCAL_SECTION_LIMIT = 12;
const LOCAL_ENTRY_LIMIT = 6;
const LOCAL_ADVICE_HINT = /宜|吉|贵|禄|合|旺|喜|德|福|天乙|长生|帝旺/;
const LOCAL_CAUTION_HINT = /冲|刑|害|破|空|煞|凶|忌|克|刃|墓|绝|劫/;
// 专有名词会撞上关键字：宫名（官禄、福德）撞吉字，星曜名（天冲星）撞「冲」字。
// 值匹配时把这些排除，只按键名匹配，否则会误报。
const PALACE_NAMES = new Set([
  "命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "交友", "仆役", "官禄", "田宅", "福德", "父母",
]);

function isProperNoun(value) {
  return PALACE_NAMES.has(value) || /[星宫]$/.test(value);
}

function scalarEntries(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return [];
  return Object.entries(node).filter(([, value]) => value === null || typeof value !== "object");
}

function flattenStructured(node, path = [], depth = 0) {
  const out = [];
  if (!node || typeof node !== "object" || depth > 4) return out;
  if (Array.isArray(node)) {
    node.slice(0, 12).forEach((child, index) => {
      if (child && typeof child === "object") {
        out.push(...flattenStructured(child, [...path, `#${index + 1}`], depth + 1));
      } else if (child !== null && child !== undefined && String(child).trim()) {
        // 字符串数组（如八字的干支关系、黄历的吉神）没有子键，归属到所在区块
        out.push({ path, value: String(child).trim() });
      }
    });
    return out;
  }
  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === "object") {
      out.push(...flattenStructured(value, [...path, key], depth + 1));
    } else if (value !== null && value !== undefined && String(value).trim()) {
      out.push({ path: [...path, key], value: String(value).trim() });
    }
  }
  return out;
}

// 嵌套值（如藏干、核心基调）展平成一行文字，超长截断，避免关键解读变成一堵墙
function renderValue(value) {
  if (Array.isArray(value)) {
    return value.map(renderValue).filter(Boolean).join("、");
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, child]) => {
        const text = renderValue(child);
        return text ? `${key} ${text}` : "";
      })
      .filter(Boolean)
      .join("；");
  }
  return value === null || value === undefined ? "" : String(value);
}

// 路径里的「#1」这类数组下标对读者无意义，展示时去掉
function displayPath(path) {
  const named = path.filter((segment) => !/^#\d+$/.test(segment));
  return named.slice(-2).join("·") || String(path[path.length - 1]);
}

function renderStructuredBlock(name, node) {
  if (Array.isArray(node)) {
    const lines = node
      .slice(0, LOCAL_SECTION_LIMIT)
      .map((item) => {
        if (!item || typeof item !== "object") return String(item ?? "");
        const entries = Object.entries(item).filter(([, value]) => renderValue(value));
        if (!entries.length) return "";
        const head = renderValue(entries[0][1]).slice(0, 40);
        const tail = entries
          .slice(1)
          .map(([key, value]) => `${key} ${renderValue(value)}`)
          .join(" / ")
          .slice(0, 160);
        return `${head}${tail ? `（${tail}）` : ""}`;
      })
      .filter(Boolean);
    return lines.length ? `**${name}**\n${bulletLines(lines)}` : "";
  }
  const entries = Object.entries(node || {}).filter(([, value]) => renderValue(value));
  if (!entries.length) return "";
  return `**${name}**\n${entries.map(([key, value]) => `- ${key}：${renderValue(value).slice(0, 200)}`).join("\n")}`;
}

function buildLocalToolReading(toolName, item) {
  const structured = item?.response?.structured || null;
  const title = toolLabel(toolName);

  if (!structured || typeof structured !== "object" || !Object.keys(structured).length) {
    return [
      "## 排盘概览",
      "",
      `本次${title}未返回结构化数据，可直接查看上方排盘结果原文。`,
      "",
      "## 温馨提示",
      "",
      LOCAL_DISCLAIMER,
    ].join("\n");
  }

  const blocks = Object.entries(structured);
  const flat = flattenStructured(structured);
  const highlights = blocks
    .slice(0, 3)
    .map(([, node]) =>
      scalarEntries(node)
        .slice(0, 4)
        .map(([key, value]) => `${key} ${value}`)
        .join("，")
    )
    .filter(Boolean)
    .join("；");

  const pick = (pattern) => {
    const seen = new Set();
    return flat
      .filter((entry) => {
        if (pattern.test(entry.path.join(""))) return true;
        if (entry.value.length > 12 || isProperNoun(entry.value)) return false;
        return pattern.test(entry.value);
      })
      .map((entry) => `${displayPath(entry.path)}：${entry.value}`)
      .filter((line) => {
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
      })
      .slice(0, LOCAL_ENTRY_LIMIT);
  };

  const advice = pick(LOCAL_ADVICE_HINT);
  const caution = pick(LOCAL_CAUTION_HINT);
  const detail = blocks.map(([name, node]) => renderStructuredBlock(name, node)).filter(Boolean);

  return [
    "## 排盘概览",
    "",
    `本次${title}共计算 ${blocks.length} 个部分：${blocks.map(([name]) => name).join("、")}。${highlights ? `要点：${highlights}。` : ""}`,
    "",
    "## 关键解读",
    "",
    detail.length ? detail.join("\n\n") : "本次结果中没有可展开的结构化字段。",
    "",
    "## 建议",
    "",
    advice.length
      ? bulletLines(advice)
      : "- 本次结果中没有可直接提炼为建议的宜忌类字段。",
    "",
    "## 需要注意",
    "",
    caution.length
      ? bulletLines(caution)
      : "- 本次结果中没有可直接提炼为注意事项的冲煞类字段。",
    "",
    "## 温馨提示",
    "",
    LOCAL_DISCLAIMER,
  ].join("\n");
}

const AI_READING_TEMPLATE = [
  "【输出格式】（必须严格遵循，每次输出结构完全一致）",
  "1. 用 Markdown 小节标题分节，小节标题固定为：## 排盘概览、## 关键解读、## 建议、## 需要注意、## 温馨提示，顺序与标题文字不得更改或增减。",
  "2. 各小节内容要求：",
  "   - 排盘概览：2~3 句话总结本次排盘的核心结论。",
  "   - 关键解读：分点列出，每点格式为「结论：依据」，结论一句白话，依据写明来自排盘结果的哪一项。",
  "   - 建议：2~4 条可操作建议，用“- ”列表逐条列出。",
  "   - 需要注意：只写排盘结果能支撑的具体提醒（如冲、刑、空亡、煞星落宫等）；不要罗列“盘面未提供 / 无法确定”的内容，也不要为凑字数而写。",
  "   - 温馨提示：提醒仅供传统文化研究与娱乐参考。",
  "3. 正文开头直接是“## 排盘概览”，不要输出任何开场白、解释或前缀。",
].join("\n");

async function callAiChat(toolName, item, userText) {
  const systemPrompt = [
    "你是传统命理排盘工具的命理顾问，像一位经验丰富但严谨的传统命理师。",
    "请结合用户档案、当前排盘结果和对话历史回答。",
    "回答时先说明依据，再给建议；只讲排盘结果里能支撑的内容，结果里没有的直接不提，不要写“无法确定”“未给出”这类话，更不能编造。",
    "不要承诺确定结果，不做医疗、投资、法律等决策建议。",
    "结尾提醒仅供传统文化研究与娱乐参考。",
    AI_READING_TEMPLATE,
    "本次计算依据如下：",
    buildAiPrompt(toolName, item),
  ].join("\n\n");
  return callAiApi(systemPrompt, `${userText}\n\n请严格按上述输出格式输出，不要改动小节标题。`);
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

function renderShell(content, activeNav = "", pageClass = "") {
  const navButton = (item, extra = "") =>
    `<button data-action="${item.action}"${extra} class="${activeNav === item.id ? "is-active" : ""}">${item.label}</button>`;
  const bottomButton = (item) =>
    `<button data-action="${item.action}" data-icon="${item.icon}" class="${activeNav === item.id ? "is-active" : ""}">${item.label}</button>`;

  return `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#/">
          <span class="brand-seal">${BRAND_MARK}</span>
          <span class="brand-title">赛博玄学</span>
        </a>
        <div class="topbar-right">
          <nav class="topbar-nav" aria-label="主导航">
            ${NAV_ITEMS.map((item) => navButton(item)).join("")}
          </nav>
          <div class="font-menu-anchor">
            <button class="icon-button font-toggle" data-action="font-menu" aria-haspopup="true" aria-expanded="false" aria-label="调整字号">A+</button>
            <div class="font-menu" hidden>
              <div class="font-menu-title">字号大小</div>
              ${FONT_SCALES.map(
                (s) => `
                <button data-action="set-font" data-font="${s.id}" class="${getFontScaleId() === s.id ? "is-active" : ""}" aria-pressed="${getFontScaleId() === s.id}">
                  <span class="font-sample font-sample-${s.id}" aria-hidden="true">字</span>${s.label}
                </button>
              `
              ).join("")}
            </div>
          </div>
        </div>
      </header>
      <main class="page ${pageClass}">${content}</main>
      <nav class="bottom-nav">
        ${NAV_ITEMS.map((item) => bottomButton(item)).join("")}
      </nav>
    </div>
  `;
}

/* ============================================================
   对话主界面：Agent 会话（工具能力保留，宫格降为次级入口列表）
   ============================================================ */

// 会话式存储：索引只存元信息，消息按会话分键，避免一条无限长的记录。
function newChatId() {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function chatMessagesKey(id) {
  return `${CHAT_SESSION_PREFIX}${id}`;
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value === null || value === undefined ? fallback : value;
  } catch {
    return fallback;
  }
}

function chatSessionTitle(log) {
  const first = (log || []).find((entry) => entry.role === "user" && entry.content);
  const text = String(first?.content || "新对话").replace(/\s+/g, " ").trim();
  if (!text) return "新对话";
  return text.length > CHAT_TITLE_LIMIT ? `${text.slice(0, CHAT_TITLE_LIMIT)}…` : text;
}

// 旧版只有一个 taibu:chat 键，迁移成一段历史会话；不设为当前会话，保证打开仍是新的
function migrateLegacyChat() {
  const legacy = localStorage.getItem(CHAT_KEY);
  if (legacy === null) return;
  localStorage.removeItem(CHAT_KEY);
  let log = [];
  try {
    log = JSON.parse(legacy) || [];
  } catch {
    return;
  }
  if (!Array.isArray(log) || !log.length) return;
  const id = newChatId();
  localStorage.setItem(chatMessagesKey(id), JSON.stringify(log.slice(-CHAT_LOG_LIMIT)));
  const index = readJson(CHAT_INDEX_KEY, []);
  const list = Array.isArray(index) ? index : [];
  list.unshift({
    id,
    title: chatSessionTitle(log),
    createdAt: log[0]?.time || new Date().toISOString(),
    updatedAt: log[log.length - 1]?.time || new Date().toISOString(),
    count: log.length,
  });
  saveChatIndex(list);
  localStorage.removeItem(CHAT_ACTIVE_KEY);
}

function getChatIndex() {
  migrateLegacyChat();
  const index = readJson(CHAT_INDEX_KEY, []);
  return Array.isArray(index) ? index.filter((item) => item && item.id) : [];
}

function saveChatIndex(index) {
  localStorage.setItem(CHAT_INDEX_KEY, JSON.stringify(index));
}

function getActiveChatId() {
  const id = localStorage.getItem(CHAT_ACTIVE_KEY);
  if (id) return id;
  const fresh = newChatId();
  localStorage.setItem(CHAT_ACTIVE_KEY, fresh);
  return fresh;
}

function setActiveChatId(id) {
  localStorage.setItem(CHAT_ACTIVE_KEY, id);
}

function getChatLog() {
  return getChatLogFor(getActiveChatId());
}

function getChatLogFor(id) {
  const log = readJson(chatMessagesKey(id), []);
  return Array.isArray(log) ? log : [];
}

function saveChatLog(log) {
  saveChatLogFor(getActiveChatId(), log);
}

// 指定会话写入：生成中用户可能切到别的会话，落库要写回原来那段对话
function saveChatLogFor(id, log) {
  const trimmed = log.slice(-CHAT_LOG_LIMIT);
  localStorage.setItem(chatMessagesKey(id), JSON.stringify(trimmed));
  if (!trimmed.length) return;
  const list = getChatIndex();
  const existing = list.find((item) => item.id === id);
  saveChatIndex([
    {
      id,
      title: chatSessionTitle(trimmed),
      createdAt: existing?.createdAt || trimmed[0]?.time || new Date().toISOString(),
      updatedAt: trimmed[trimmed.length - 1]?.time || new Date().toISOString(),
      count: trimmed.length,
    },
    ...list.filter((item) => item.id !== id),
  ]);
}

function listChatSessions() {
  return getChatIndex()
    .slice()
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

// 开新会话：当前会话已有内容才换新 id，避免历史里堆一堆空会话
function startNewChat() {
  const log = readJson(chatMessagesKey(getActiveChatId()), []);
  if (Array.isArray(log) && log.length) setActiveChatId(newChatId());
}

function deleteChatSession(id) {
  localStorage.removeItem(chatMessagesKey(id));
  saveChatIndex(getChatIndex().filter((item) => item.id !== id));
  if (localStorage.getItem(CHAT_ACTIVE_KEY) === id) localStorage.removeItem(CHAT_ACTIVE_KEY);
}

function profileLine(profile) {
  const gender = profile.gender === "female" ? "女" : "男";
  const calendar = profile.calendarType === "lunar" ? "农历" : "公历";
  const place = profile.birthPlace ? `，出生地${profile.birthPlace}` : "";
  return `${profile.name}（${gender}，${calendar}${profile.birthYear}年${profile.birthMonth}月${profile.birthDay}日${profile.birthHour}时${profile.birthMinute}分${place}）`;
}

function buildAgentSystemPrompt() {
  const active = getActiveProfile();
  const others = getProfiles().filter((profile) => profile.id !== active?.id);
  return [
    "你是「赛博玄学」App 中的命理助手，用简洁、温和、现代的中文与用户对话。",
    `今天是 ${todayString()}。`,
    "",
    "你可以调用工具为用户排盘：八字、紫微斗数、六爻、梅花易数、奇门遁甲、大六壬、小六壬、塔罗、黄历、西方占星、太乙九星等。",
    "",
    "行为规则：",
    "1. 用户想排盘或问命理问题时，直接调用最合适的工具，不要先反问；参数能从用户档案或上下文推断出来的就直接填。",
    "2. 工具返回结果后，用 Markdown 小节输出解读，小节标题固定为：## 排盘概览、## 关键解读、## 建议、## 需要注意、## 温馨提示。顺序与文字不得更改、增减。",
    "3. 「关键解读」分点列出，每点格式为「结论：依据」，依据要写明来自排盘结果的哪一项。",
    "4. 「需要注意」只写排盘结果能支撑的具体提醒（如冲、刑、空亡、煞星落宫等），不要罗列“盘面未提供 / 无法确定”的内容，也不要为凑字数而写。",
    "5. 严禁编造排盘结果里没有的信息；确实无法从盘面得出的，直接不提，不要写“无法确定”“未给出”这类话。不做医疗、投资、法律等决策建议；结尾提醒仅供传统文化研究与娱乐参考。",
    "6. 涉及运势或时间的问题（今年、明年、这个月、大运、流年、近期等），必须调用大运 / 运限类工具（bazi_dayun、ziwei_horoscope 等）取到真实数据后再回答，不得以“盘面未提供”为由搪塞。",
    "7. 与排盘无关的闲聊或知识问答，正常回答即可，不必调用工具。",
    "8. 同一个问题不要重复调用同一个工具。",
    active
      ? `\n当前用户档案：${profileLine(active)}。需要出生信息时优先使用该档案，不要再向用户询问。`
      : "\n用户尚未建立档案。若工具需要出生信息，先用一句话询问用户的称呼、性别、出生年月日时与出生地，此时不要调用工具。",
    others.length
      ? `用户还保存了其他档案：${others.map(profileLine).join("；")}。用户提到其中某人时使用对应档案。`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

// 历史里 assistant 的 raw 带着整段排盘原文（动辄数千字），全量回灌会明显拖慢首 token。
// 只让最近 CHAT_RAW_KEEP 条保留原文，更早的降级为解读文本本身；上限与工具结果一致，
// 保证最近一两轮的命盘不会被截断（追问时还需要原始盘面）。
const CHAT_RAW_KEEP = 2;
const CHAT_RAW_LIMIT = 8000;

function chatHistoryForApi(log) {
  // 生成中的半截回复不算历史（还没定稿），别回灌给模型
  const recent = log.filter((entry) => !entry.streaming).slice(-CHAT_HISTORY_LIMIT);
  const assistantIndexes = recent
    .map((entry, index) => (entry.role === "user" ? -1 : index))
    .filter((index) => index >= 0);
  const keepRawFrom =
    assistantIndexes.length > CHAT_RAW_KEEP ? assistantIndexes[assistantIndexes.length - CHAT_RAW_KEEP] : 0;

  return recent
    .map((entry, index) => {
      const isUser = entry.role === "user";
      const keepRaw = isUser || index >= keepRawFrom;
      let content = String(keepRaw ? entry.raw || entry.content || "" : entry.content || "");
      if (content.length > CHAT_RAW_LIMIT) content = `${content.slice(0, CHAT_RAW_LIMIT)}\n…（内容过长已截断）`;
      return { role: isUser ? "user" : "assistant", content };
    })
    .filter((entry) => entry.content.trim());
}

async function executeAgentTool(name, args) {
  const data = await callToolApi(name, args);
  saveHistory(name, args, data);
  return data;
}

function renderToolTrace(tool) {
  const meta = getToolMeta(tool.name);
  return `
    <details class="chat-tool-card${tool.ok === false ? " is-error" : ""}">
      <summary>
        <span class="chat-tool-icon" style="--card-tint:${meta.tint};--card-ink:${meta.ink}">${escapeHtml(meta.icon)}</span>
        <span class="chat-tool-name">${escapeHtml(toolLabel(tool.name))}</span>
        <span class="chat-tool-state">${tool.ok === false ? "失败" : "已排盘"}</span>
      </summary>
      <pre class="chat-tool-text">${escapeHtml(tool.text || "（无输出）")}</pre>
    </details>
  `;
}

function renderChatMessage(entry) {
  if (entry.role === "user") {
    return `
      <div class="chat-row user">
        <div class="chat-bubble user"><div class="chat-bubble-body">${escapeHtml(entry.content)}</div></div>
      </div>
    `;
  }
  // 被中断（切后台/熄屏/切页面时连接断了）：显示已生成的部分 + 重试，而不是留一片空白
  if (entry.interrupted) {
    const interruptedTools = (entry.tools || []).map(renderToolTrace).join("");
    const interruptedBody = entry.content
      ? `<div class="chat-bubble-body markdown-render">${renderMarkdown(entry.content)}</div>`
      : "";
    const reason = entry.errorText ? `：${escapeHtml(entry.errorText)}` : "";
    return `
      <div class="chat-row assistant">
        <span class="chat-avatar" aria-hidden="true">卜</span>
        <div class="chat-bubble assistant">
          ${interruptedTools}
          <div class="chat-notice is-error">这次生成中断了${reason}，可以重新生成。</div>
          ${interruptedBody}
          <button class="secondary-button chat-retry-button" data-action="chat-retry" data-id="${escapeHtml(entry.id || "")}">重新生成</button>
        </div>
      </div>
    `;
  }
  const tools = (entry.tools || []).map(renderToolTrace).join("");
  const body = entry.error
    ? `<div class="chat-bubble-body chat-error-text">${escapeHtml(entry.content)}</div>`
    : `<div class="chat-bubble-body markdown-render">${renderMarkdown(entry.content || "")}</div>`;
  return `
    <div class="chat-row assistant">
      <span class="chat-avatar" aria-hidden="true">卜</span>
      <div class="chat-bubble assistant">${tools}${body}</div>
    </div>
  `;
}

function chatQuickChips() {
  const active = getActiveProfile();
  const chips = [];
  if (active) chips.push({ label: "今日报告", action: "report" });
  chips.push({ label: "今日运势", text: "帮我看看今天的运势，需要注意什么？" });
  chips.push({ label: "抽一张塔罗", text: "帮我抽一张塔罗牌，看看我现在的状态。" });
  chips.push({ label: "事业方向", text: "帮我看看今年的事业方向。" });
  if (!active) chips.push({ label: "建立档案", action: "ai-settings" });

  return chips
    .map((chip) =>
      chip.action
        ? `<button class="chat-chip" data-action="${chip.action}">${escapeHtml(chip.label)}</button>`
        : `<button class="chat-chip" data-action="chat-chip" data-text="${escapeHtml(chip.text)}">${escapeHtml(chip.label)}</button>`
    )
    .join("");
}

function renderChatHero() {
  const active = getActiveProfile();
  const settings = getAiSettings();
  const hasKey = aiEnabled();
  const relay = isRelayProvider(settings);
  const title = active ? `你好，${escapeHtml(active.name)}` : "你好，我是赛博玄学助手";
  const subtitle = active
    ? hasKey
      ? "已记下你的出生信息，说一句话就能排盘解盘。"
      : "已记下你的出生信息，说一句话就能排盘并给出本地解读。"
    : hasKey
      ? "说一句话就能排盘：八字、紫微、六爻、塔罗……需要出生信息时我会问你。"
      : "说一句话就能排盘：今日运势、八字、紫微、星盘、塔罗。";
  let notice = "";
  if (!hasKey && relay) {
    notice = `<div class="chat-notice">免费体验次数已用完，已切换为本地解读。<button class="link-button" data-action="ai-settings">填写自己的密钥</button>可继续在对话里问任意问题。</div>`;
  } else if (!hasKey) {
    notice = `<div class="chat-notice">当前为本地模式：可以直接问今日运势、八字、紫微、星盘、塔罗。<button class="link-button" data-action="ai-settings">配置模型</button>后可问任意问题。</div>`;
  } else if (relay) {
    notice = `<div class="chat-notice">免费体验中：${escapeHtml(relayQuotaText())}，用完可到「我的」填写自己的密钥。</div>`;
  }
  return `
    <div class="chat-hero">
      <div class="chat-hero-seal">${BRAND_MARK}</div>
      <h2 class="chat-hero-title">${title}</h2>
      <p class="chat-hero-text">${subtitle}</p>
      ${notice}
    </div>
  `;
}

// ===== 生成中的对话轮次 =====
// 这轮状态原先只活在 DOM 和闭包里：生成中切到工具页再回来、切后台熄屏、WebView 被系统
// 回收后重载，正在生成的气泡会消失、回复也跟着丢。现在把这一轮提到模块级，并把已生成的
// 部分节流写进对话记录（带 streaming 标记），重绘/重载后都能接着显示，断了还能一键重试。
let chatTurn = null;

function liveToolCardHtml(tool) {
  const meta = getToolMeta(tool.name);
  const running = tool.ok === undefined;
  const stateText = running ? "排盘中…" : tool.ok ? "已排盘" : "失败";
  const cls = running ? " is-running" : tool.ok ? "" : " is-error";
  return `
    <div class="chat-tool-card${cls}">
      <span class="chat-tool-icon" style="--card-tint:${meta.tint};--card-ink:${meta.ink}">${escapeHtml(meta.icon)}</span>
      <span class="chat-tool-name">${escapeHtml(toolLabel(tool.name))}</span>
      <span class="chat-tool-state">${stateText}</span>
    </div>
  `;
}

// 进行中气泡的完整 HTML：切页面回来时由 renderChat 重建；paintLive 只做局部更新，
// 不整块重建是为了保住打字动画（重建会让动画每次从头播）。
function liveTurnHtml() {
  if (!chatTurn) return "";
  const notices = (chatTurn.notices || [])
    .map((message) => `<div class="chat-notice">${escapeHtml(message)}</div>`)
    .join("");
  const tools = (chatTurn.tools || []).map(liveToolCardHtml).join("");
  return `
    <div class="chat-row assistant" data-chat-live>
      <span class="chat-avatar" aria-hidden="true">卜</span>
      <div class="chat-bubble assistant is-live">
        <div class="chat-tools" data-live-tools>${notices}${tools}</div>
        <div class="chat-bubble-body markdown-render" data-live-body>${renderMarkdown(chatTurn.buffer || "")}</div>
        <div class="typing-row">
          <div class="typing-indicator" data-live-typing${chatTurn.typing ? "" : " hidden"}><span></span><span></span><span></span></div>
          <span class="typing-hint" data-live-hint${chatTurn.hint ? "" : " hidden"}>${escapeHtml(chatTurn.hint || "")}</span>
        </div>
      </div>
    </div>
  `;
}

function paintLive() {
  if (!chatTurn) return;
  const toolsEl = app.querySelector("[data-live-tools]");
  if (toolsEl) {
    const notices = (chatTurn.notices || [])
      .map((message) => `<div class="chat-notice">${escapeHtml(message)}</div>`)
      .join("");
    toolsEl.innerHTML = notices + (chatTurn.tools || []).map(liveToolCardHtml).join("");
  }
  const bodyEl = app.querySelector("[data-live-body]");
  if (bodyEl) bodyEl.innerHTML = renderMarkdown(chatTurn.buffer || "");
  const typingEl = app.querySelector("[data-live-typing]");
  if (typingEl) typingEl.hidden = !chatTurn.typing;
  const hintEl = app.querySelector("[data-live-hint]");
  if (hintEl) {
    hintEl.textContent = chatTurn.hint || "";
    hintEl.hidden = !chatTurn.hint;
  }
}

function writeChatTurnEntry(entryId, entry, chatId) {
  const id = chatId || getActiveChatId();
  const log = getChatLogFor(id);
  const index = log.findIndex((item) => item.id === entryId);
  const merged = { ...entry, id: entryId };
  if (index >= 0) log[index] = merged;
  else log.push(merged);
  saveChatLogFor(id, log);
}

function removeChatEntry(entryId, chatId) {
  const id = chatId || getActiveChatId();
  saveChatLogFor(id, getChatLogFor(id).filter((entry) => entry.id !== entryId));
}

// 把已生成的部分落库：熄屏/切后台被系统掐断连接、WebView 被回收重载后，内容不丢
function persistChatTurnPartial() {
  if (!chatTurn) return;
  writeChatTurnEntry(
    chatTurn.entryId,
    {
      role: "assistant",
      content: chatTurn.buffer,
      streaming: true,
      tools: (chatTurn.tools || []).filter((tool) => tool.ok !== undefined),
      retryText: chatTurn.userText,
      time: new Date().toISOString(),
    },
    chatTurn.chatId
  );
}

// 启动时把上次没跑完的 streaming 条目定格为「已中断」，
// 否则每次启动都会误判成「有进行中的轮次」而不开新会话
function finalizeStaleTurns() {
  const log = getChatLog();
  if (!log.some((entry) => entry && entry.streaming)) return false;
  saveChatLog(log.map((entry) => (entry.streaming ? { ...entry, streaming: false, interrupted: true } : entry)));
  return true;
}

// 重试被中断的一轮：删掉半截回复，用同一个提问重新生成（用户消息不重复记）
function retryChatTurn(entryId) {
  if (chatBusy) return;
  const log = getChatLog();
  const index = log.findIndex((entry) => entry.id === entryId);
  if (index < 0) return;
  let question = log[index].retryText || "";
  if (!question) {
    for (let i = index - 1; i >= 0; i--) {
      if (log[i].role === "user") {
        question = log[i].content;
        break;
      }
    }
  }
  log.splice(index, 1);
  saveChatLog(log);
  render();
  if (!question) return;
  if (hasAiKey()) {
    streamAgentReply(question, `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
  } else {
    localChatReply(question);
  }
}

function renderChat() {
  const log = getChatLog();
  const live = chatTurn && chatTurn.chatId === getActiveChatId() ? liveTurnHtml() : "";
  // 进行中的那一轮由 liveTurnHtml 画，别在记录里重复画一遍
  const stream = log
    .filter((entry) => !(chatTurn && entry.id === chatTurn.entryId))
    .map(renderChatMessage)
    .join("");
  const hasLog = log.length > 0;
  const body = hasLog ? stream : renderChatHero();
  const loadingHint = state.loading
    ? `<div class="chat-notice">正在加载排盘工具…</div>`
    : state.error
      ? `<div class="chat-notice is-error">工具加载失败：${escapeHtml(state.error)}</div>`
      : "";

  return renderShell(
    `
      <div class="chat-page">
        <div class="chat-bar">
          <button class="chat-bar-button" data-action="chat-history">历史</button>
          <span class="chat-bar-title">${escapeHtml(hasLog ? chatSessionTitle(log) : "新对话")}</span>
          <button class="chat-bar-button" data-action="chat-new">新会话</button>
        </div>
        <div class="chat-stream${hasLog ? "" : " is-empty"}" data-chat-stream>${body}${live}${loadingHint}</div>
        <div class="chat-composer">
          <div class="chat-input-row">
            <button class="icon-button chat-tool-button" data-action="chat-sheet" aria-label="快捷开始：推荐问句与排盘工具">术</button>
            <textarea data-chat-main rows="1" placeholder="说点什么，例如：帮我看看今天的运势"></textarea>
            ${renderVoiceButton()}
            <button class="primary-button" data-action="chat-send">发送</button>
          </div>
        </div>
        ${renderChatSheet()}
      </div>
    `,
    "chat",
    "page-chat"
  );
}

// 「术」按钮的弹层：推荐问句 + 排盘工具，替代原先常驻在输入框上方的那一行
function renderChatSheet() {
  const available = new Set(state.tools.map((tool) => tool.name));
  const groups = TOOL_GROUPS.map((group) => ({
    label: group.label,
    items: group.tools.filter((name) => available.has(name)),
  })).filter((group) => group.items.length);

  const tools = groups
    .map(
      (group) => `
        <div class="chat-sheet-group">
          <div class="chat-sheet-label">${escapeHtml(group.label)}</div>
          <div class="chat-sheet-tools">
            ${group.items
              .map((name) => {
                const meta = getToolMeta(name);
                return `<button class="chat-sheet-tool" data-action="tool" data-tool="${escapeHtml(name)}">
                  <span class="chat-tool-icon" style="--card-tint:${meta.tint};--card-ink:${meta.ink}">${escapeHtml(meta.icon)}</span>
                  <span>${escapeHtml(toolLabel(name))}</span>
                </button>`;
              })
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  return `
    <div class="chat-sheet" data-chat-sheet hidden>
      <div class="chat-sheet-backdrop" data-action="chat-sheet-close"></div>
      <div class="chat-sheet-panel" role="dialog" aria-label="快捷开始">
        <div class="chat-sheet-head">
          <strong>快捷开始</strong>
          <button class="chat-sheet-close" data-action="chat-sheet-close">关闭</button>
        </div>
        <div class="chat-sheet-group">
          <div class="chat-sheet-label">推荐问句</div>
          <div class="chat-sheet-chips">${chatQuickChips()}</div>
        </div>
        ${tools}
      </div>
    </div>
  `;
}

function closeChatSheet() {
  const sheet = app.querySelector("[data-chat-sheet]");
  if (sheet) sheet.hidden = true;
}

function renderChatSessions() {
  const sessions = listChatSessions();
  const items = sessions.length
    ? sessions
        .map(
          (item) => `
            <div class="session-row">
              <button class="history-item" data-action="open-chat" data-id="${escapeHtml(item.id)}">
                <span>
                  <strong>${escapeHtml(item.title || "新对话")}</strong>
                  <span>${escapeHtml(formatTime(item.updatedAt))} · ${Number(item.count) || 0} 条</span>
                </span>
                <span>继续聊</span>
              </button>
              <button class="session-delete" data-action="delete-chat" data-id="${escapeHtml(item.id)}" aria-label="删除这段对话">删除</button>
            </div>
          `
        )
        .join("")
    : `<div class="empty-box panel"><div><p>还没有历史对话。</p><button class="primary-button" data-action="chat-new">开始新对话</button></div></div>`;

  return renderShell(
    `
      <h1 class="page-heading">对话历史</h1>
      <p class="page-subtitle">每次打开都是一段新对话，旧对话都留在这里，点开可以接着聊。记录只保存在本机。</p>
      <div class="history-list">${items}</div>
    `,
    "chat"
  );
}

function renderToolsPage() {
  const available = new Set(state.tools.map((tool) => tool.name));
  const grouped = new Set();
  const groups = TOOL_GROUPS.map((group) => {
    const items = group.tools.filter((name) => available.has(name));
    items.forEach((name) => grouped.add(name));
    return { label: group.label, items };
  }).filter((group) => group.items.length);

  const rest = state.tools.map((tool) => tool.name).filter((name) => !grouped.has(name));
  if (rest.length) groups.push({ label: "其他", items: rest });

  const active = getActiveProfile();
  const reportRow = active
    ? `
      <button class="entry-row entry-row-report" data-action="report">
        <span class="entry-icon" style="--card-tint:#fae7e2;--card-ink:#a83f34">历</span>
        <span class="entry-copy">
          <strong>今日报告</strong>
          <span>按 ${escapeHtml(active.name)} 的命盘生成今日宜忌、吉时与建议</span>
        </span>
        <span class="entry-arrow" aria-hidden="true">›</span>
      </button>
    `
    : `
      <button class="entry-row" data-action="ai-settings">
        <span class="entry-icon" style="--card-tint:#dce9e5;--card-ink:#2f6f6a">我</span>
        <span class="entry-copy">
          <strong>先建立档案</strong>
          <span>保存出生信息后，排盘自动带入，并可生成今日报告</span>
        </span>
        <span class="entry-arrow" aria-hidden="true">›</span>
      </button>
    `;

  const sections = state.loading
    ? `<div class="loading-box"><div><div class="spinner"></div><div>正在加载工具...</div></div></div>`
    : state.error
      ? `<div class="error-box">${escapeHtml(state.error)}</div>`
      : groups
          .map(
            (group) => `
              <div class="section-heading"><h2>${escapeHtml(group.label)}</h2></div>
              <div class="entry-list">${group.items.map(renderToolRow).join("")}</div>
            `
          )
          .join("");

  return renderShell(
    `
      <h1 class="page-heading">工具</h1>
      <p class="page-subtitle">对话里能做的事，这里也可以单独进入。</p>
      <div class="entry-list">${reportRow}</div>
      ${sections}
      <p class="disclaimer">本工具仅供传统文化研究与娱乐参考，不构成任何决策建议。</p>
    `,
    "tools"
  );
}

function renderToolRow(name) {
  const meta = getToolMeta(name);
  const def = getToolDefinition(name);
  return `
    <button class="entry-row" data-action="tool" data-tool="${escapeHtml(name)}">
      <span class="entry-icon" style="--card-tint:${meta.tint};--card-ink:${meta.ink}">${escapeHtml(meta.icon)}</span>
      <span class="entry-copy">
        <strong>${escapeHtml(toolLabel(name))}</strong>
        <span>${escapeHtml(def?.description || "输入对应信息后开始排盘")}</span>
      </span>
      <span class="entry-arrow" aria-hidden="true">›</span>
    </button>
  `;
}

function scrollChatToEnd() {
  const stream = app.querySelector("[data-chat-stream]");
  if (!stream) return;
  const composer = app.querySelector(".chat-composer");
  const reserved = composer ? window.innerHeight - composer.getBoundingClientRect().top + 16 : 24;
  const delta = stream.getBoundingClientRect().bottom - (window.innerHeight - reserved);
  if (delta > 0) window.scrollTo({ top: window.scrollY + delta, behavior: "auto" });
}

function setChatComposerBusy(busy) {
  const input = app.querySelector("[data-chat-main]");
  const send = app.querySelector('[data-action="chat-send"]');
  const voice = app.querySelector('[data-action="chat-voice"]');
  if (input) input.disabled = busy;
  if (voice && !voice.dataset.unsupported) voice.disabled = busy;
  if (send) {
    send.disabled = busy;
    send.textContent = busy ? "思考中…" : "发送";
  }
}

const VOICE_ICON =
  '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2.5" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3.5"></path></svg>';
const CHAT_PLACEHOLDER = "说点什么，例如：帮我看看今天的运势";

let voiceListening = false;
let voiceRecognition = null;
let voiceBaseText = "";

function nativeVoiceBridge() {
  const bridge = window.AndroidBridge;
  return bridge && typeof bridge.startVoiceInput === "function" ? bridge : null;
}

function voiceSupported() {
  const bridge = nativeVoiceBridge();
  if (bridge) {
    try {
      return typeof bridge.hasVoiceInput !== "function" || Boolean(bridge.hasVoiceInput());
    } catch (error) {
      return false;
    }
  }
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function renderVoiceButton() {
  const supported = voiceSupported();
  const label = supported ? "语音输入" : "当前环境不支持语音输入";
  return `<button class="icon-button chat-voice-button" data-action="chat-voice" data-unsupported="${supported ? "" : "1"}" aria-label="${label}" title="${label}"${supported ? "" : " disabled"}>${VOICE_ICON}</button>`;
}

function applyVoiceText(text) {
  const input = app.querySelector("[data-chat-main]");
  if (!input) return;
  const spoken = String(text || "").trim();
  const merged = `${voiceBaseText}${voiceBaseText && spoken ? " " : ""}${spoken}`.trim();
  input.value = merged;
  input.dispatchEvent(new Event("input"));
}

function setVoiceListening(active) {
  voiceListening = active;
  const button = app.querySelector('[data-action="chat-voice"]');
  const input = app.querySelector("[data-chat-main]");
  if (button) {
    button.classList.toggle("is-listening", active);
    button.setAttribute("aria-pressed", String(active));
  }
  if (input) input.placeholder = active ? "正在聆听…说完点一下麦克风" : CHAT_PLACEHOLDER;
}

function stopVoiceInput() {
  if (voiceRecognition) {
    try {
      voiceRecognition.stop();
    } catch (error) {
      // 已结束的识别再 stop 会抛异常，忽略即可。
    }
    voiceRecognition = null;
  }
  const bridge = nativeVoiceBridge();
  if (bridge && typeof bridge.stopVoiceInput === "function") {
    try {
      bridge.stopVoiceInput();
    } catch (error) {
      // 忽略。
    }
  }
  setVoiceListening(false);
}

function startVoiceInput() {
  if (voiceListening) {
    stopVoiceInput();
    return;
  }
  const input = app.querySelector("[data-chat-main]");
  voiceBaseText = input ? input.value.trim() : "";

  const bridge = nativeVoiceBridge();
  if (bridge) {
    setVoiceListening(true);
    try {
      bridge.startVoiceInput();
    } catch (error) {
      setVoiceListening(false);
      window.alert(`语音输入启动失败：${error.message}`);
    }
    return;
  }

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    window.alert("当前环境不支持语音输入，请直接用键盘输入。");
    return;
  }

  const recognition = new Recognition();
  voiceRecognition = recognition;
  recognition.lang = "zh-CN";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let settled = "";
  recognition.onstart = () => setVoiceListening(true);
  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = result[0] ? result[0].transcript : "";
      if (result.isFinal) settled += transcript;
      else interim += transcript;
    }
    applyVoiceText(`${settled}${interim}`);
  };
  recognition.onerror = (event) => {
    voiceRecognition = null;
    setVoiceListening(false);
    const reasons = {
      "not-allowed": "没有麦克风权限，请在浏览器设置里允许后重试。",
      "service-not-allowed": "浏览器未启用语音识别服务。",
      "no-speech": "没有听到声音，请再说一次。",
      "audio-capture": "没有检测到麦克风设备。",
      network: "语音识别需要联网，请检查网络后重试。",
    };
    window.alert(reasons[event.error] || `语音识别失败：${event.error || "未知错误"}`);
  };
  recognition.onend = () => {
    voiceRecognition = null;
    setVoiceListening(false);
  };

  try {
    recognition.start();
  } catch (error) {
    voiceRecognition = null;
    setVoiceListening(false);
    window.alert(`语音输入启动失败：${error.message}`);
  }
}

// 安卓壳通过原生 SpeechRecognizer 识别，再回调到这里（浏览器环境不注册）
function initVoiceBridge() {
  window.__taibuVoiceState = (state) => setVoiceListening(state === "listening");
  window.__taibuVoicePartial = (text) => applyVoiceText(text);
  window.__taibuVoiceResult = (text) => {
    setVoiceListening(false);
    applyVoiceText(text);
  };
  window.__taibuVoiceError = (message) => {
    setVoiceListening(false);
    window.alert(String(message || "语音识别失败，请重试。"));
  };
}

async function sendChatMessage(rawText) {
  const text = String(rawText || "").trim();
  if (!text || chatBusy) return;
  if (voiceListening) stopVoiceInput();

  const log = getChatLog();
  log.push({ role: "user", content: text, time: new Date().toISOString() });
  saveChatLog(log);
  render();
  if (hasAiKey()) {
    // 一次提问内的多轮工具调用共用一个轮次 ID，中转服务只扣一次免费额度
    const turnId = `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const outcome = await streamAgentReply(text, turnId);
    if (outcome === "relay-blocked") {
      await localChatReply(text, "免费体验次数已用完，这次改用本地解读。");
    }
    return;
  }
  await localChatReply(text);
}

// 生成期间持原生「部分唤醒锁」（仅 APK 有 AndroidBridge）：熄屏/切后台时 CPU 不休眠，
// 流式连接不会被系统掐断。浏览器 / PWA 没有这个桥，调用是空操作。
// 用计数而非布尔，避免对话与今日报告同时生成时互相把锁提前放掉。
let nativeGenCount = 0;
function setNativeGenerating(on) {
  nativeGenCount += on ? 1 : -1;
  if (nativeGenCount < 0) nativeGenCount = 0;
  try {
    if (window.AndroidBridge && typeof window.AndroidBridge.setGenerating === "function") {
      window.AndroidBridge.setGenerating(nativeGenCount > 0);
    }
  } catch (error) {
    // 桥调用失败不影响主流程
  }
}

async function streamAgentReply(userText, turnId = "") {
  const settings = getAiSettings();
  chatBusy = true;
  setNativeGenerating(true);

  // 把这一轮提到模块级：切页面/重绘/切后台都不会丢，回来还能看到进行中的内容
  chatTurn = {
    chatId: getActiveChatId(),
    entryId: `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    userText,
    buffer: "",
    tools: [],
    notices: [],
    hint: "正在理解你的问题…",
    typing: true,
  };
  render();
  setChatComposerBusy(true);
  scrollChatToEnd();

  let paintTimer = 0;
  let lastPaint = 0;
  let lastScroll = 0;
  let lastPersist = 0;

  // 长解读时每帧全量重解析 markdown + 重建 DOM 会越来越卡，节流到约 80ms 一次；
  // 流结束后 finally 里的 render() 会用落库内容整体重绘，所以尾部不会丢。
  const PAINT_INTERVAL_MS = 80;

  const schedulePaint = () => {
    if (paintTimer) return;
    paintTimer = setTimeout(() => {
      paintTimer = 0;
      lastPaint = Date.now();
      paintLive();
      const now = Date.now();
      if (now - lastScroll > 200) {
        lastScroll = now;
        scrollChatToEnd();
      }
    }, Math.max(0, PAINT_INTERVAL_MS - (Date.now() - lastPaint)));
  };

  const onEvent = (event) => {
    if (!chatTurn) return;
    if (event.type === "round") {
      chatTurn.buffer = "";
      chatTurn.typing = true;
      chatTurn.hint = event.round > 0 ? "正在整理解读…" : "正在理解你的问题…";
      paintLive();
      return;
    }
    if (event.type === "delta") {
      chatTurn.buffer += event.text;
      chatTurn.typing = false;
      chatTurn.hint = "";
      schedulePaint();
      // 边生成边落库：熄屏/切后台被系统掐断时，用户至少能看到已生成的部分
      const now = Date.now();
      if (now - lastPersist > 400) {
        lastPersist = now;
        persistChatTurnPartial();
      }
      return;
    }
    if (event.type === "tool") {
      chatTurn.tools.push({ name: event.name, ok: undefined });
      chatTurn.typing = true;
      chatTurn.hint = "正在排盘…";
      paintLive();
      scrollChatToEnd();
      return;
    }
    if (event.type === "tool-done") {
      const pending = chatTurn.tools.filter((tool) => tool.name === event.name && tool.ok === undefined).pop();
      if (pending) pending.ok = event.ok;
      paintLive();
      return;
    }
    if (event.type === "notice") {
      chatTurn.notices.push(event.message);
      paintLive();
    }
  };

  try {
    const result = await runAgent({
      settings: {
        ...settings,
        allowKeyless: isRelayProvider(settings),
        headers: aiRequestHeaders(settings, turnId),
        onResponse: (resp) => captureRelayQuota(resp, settings),
      },
      systemPrompt: buildAgentSystemPrompt(),
      history: chatHistoryForApi(getChatLog().slice(0, -1)),
      userText,
      tools: toOpenAiTools(state.tools),
      executeTool: executeAgentTool,
      onEvent,
    });
    const trace = result.trace || [];
    const draftText = (result.text || chatTurn.buffer).trim() || "（模型没有返回内容）";
    // 落库前做本地核验：把解读里查不到出处的术数名词就地标注（只追加说明，不改写模型结论）
    const finalText = verifyChatReading(draftText, trace);
    const parts = trace
      .filter((item) => item.ok)
      .map((item) => `【排盘结果 · ${toolLabel(item.name)}】\n${item.text}`);
    writeChatTurnEntry(
      chatTurn.entryId,
      {
        role: "assistant",
        content: finalText,
        raw: parts.length ? `${parts.join("\n\n")}\n\n【解读】\n${finalText}` : finalText,
        tools: trace.map((item) => ({ name: item.name, ok: item.ok, text: item.text })),
        time: new Date().toISOString(),
      },
      chatTurn.chatId
    );
  } catch (error) {
    // 免费体验用完 / 服务端熔断：不留错误气泡，交给本地解读接管
    if (isRelayProvider(settings) && isRelayBlockError(error)) {
      markRelayExhausted();
      removeChatEntry(chatTurn.entryId, chatTurn.chatId);
      return "relay-blocked";
    }
    // 切后台/熄屏/切页面时连接被掐断会走到这里：保留已生成的部分，给一个「重新生成」
    writeChatTurnEntry(
      chatTurn.entryId,
      {
        role: "assistant",
        content: chatTurn.buffer.trim(),
        interrupted: true,
        errorText: error.message,
        tools: chatTurn.tools.filter((tool) => tool.ok !== undefined),
        retryText: userText,
        time: new Date().toISOString(),
      },
      chatTurn.chatId
    );
  } finally {
    if (paintTimer) clearTimeout(paintTimer);
    paintTimer = 0;
    chatTurn = null;
    chatBusy = false;
    setNativeGenerating(false);
    render();
    scrollChatToEnd();
  }
}

// ===== 本地模式的对话 =====
// 没有模型就没有意图理解能力，这里只做「明确提到工具名 / 今日黄历」的关键词路由：
// 命中不了就给出引导，不猜、不乱调工具。
const LOCAL_INTENTS = [
  { tool: "almanac", pattern: /今日|今天|明天|黄历|宜忌|吉时|方位|运势/ },
  { tool: "ziwei", pattern: /紫微|斗数|命宫|主星|五行局/ },
  { tool: "bazi", pattern: /八字|四柱|日主|十神|命盘/ },
  { tool: "astrology", pattern: /星盘|占星|上升星座/ },
  { tool: "tarot", pattern: /塔罗|抽牌|牌阵/ },
  { tool: "liuyao", pattern: /六爻|起卦|摇卦|卦象/ },
  { tool: "meihua", pattern: /梅花/ },
  { tool: "qimen", pattern: /奇门|遁甲/ },
  { tool: "daliuren", pattern: /大六壬|六壬/ },
  { tool: "xiaoliuren", pattern: /小六壬/ },
  { tool: "taiyi", pattern: /太乙/ },
];

// 本地模式只跑「有档案即可」或「零参数」的工具；其余工具参数需要用户自己填，引导去工具页
const LOCAL_BIRTH_TOOLS = new Set(["bazi", "ziwei", "astrology"]);
const LOCAL_RUNNABLE = new Set(["almanac", "tarot", ...LOCAL_BIRTH_TOOLS]);

function localToolArgs(toolName, text, profile) {
  const birth = profile ? profileToRequest(profile) : {};
  if (toolName === "almanac") return { ...birth, date: todayString() };
  if (toolName === "tarot") return { question: text };
  if (toolName === "astrology") {
    return {
      birthYear: birth.birthYear,
      birthMonth: birth.birthMonth,
      birthDay: birth.birthDay,
      birthHour: birth.birthHour,
      birthMinute: birth.birthMinute,
    };
  }
  return { ...birth };
}

function localReadingFor(toolName, args, result) {
  if (toolName === "almanac") {
    return buildLocalDailyReading({
      date: todayString(),
      almanac: { text: result.text, structured: result.structured || null, raw: result.raw || null },
    });
  }
  return buildLocalToolReading(toolName, {
    request: args,
    response: result,
    time: new Date().toISOString(),
  });
}

async function localChatReply(text, notice = "") {
  const stream = app.querySelector("[data-chat-stream]");
  if (!stream) return;

  chatBusy = true;
  setChatComposerBusy(true);

  const row = document.createElement("div");
  row.className = "chat-row assistant";
  row.innerHTML = `
    <span class="chat-avatar" aria-hidden="true">卜</span>
    <div class="chat-bubble assistant">
      <div class="chat-tools" data-live-tools>${notice ? `<div class="chat-notice">${escapeHtml(notice)}</div>` : ""}</div>
      <div class="chat-bubble-body markdown-render" data-live-body></div>
    </div>
  `;
  stream.appendChild(row);
  const liveTools = row.querySelector("[data-live-tools]");
  const liveBody = row.querySelector("[data-live-body]");
  scrollChatToEnd();

  const profile = getActiveProfile();
  const intent = LOCAL_INTENTS.find((rule) => rule.pattern.test(text));
  let content = "";
  let trace = [];

  try {
    if (!intent) {
      content = [
        "本地模式下我只认得几类明确的问题：今日运势、八字、紫微、星盘、塔罗。",
        "",
        "你可以直接说「看看我今天的运势」，或点左下角「术」打开工具列表自己排盘。",
        "",
        `想在对话里问任意问题（例如「今年适合换工作吗」），${LOCAL_UPGRADE_HINT}`,
      ].join("\n");
    } else if (!LOCAL_RUNNABLE.has(intent.tool)) {
      content = [
        `「${toolLabel(intent.tool)}」需要的参数比较多，本地模式无法替你决定。`,
        "",
        `请点左下角「术」→「${toolLabel(intent.tool)}」自己填参数排盘，排完同样能看到本地解读。`,
        "",
        LOCAL_UPGRADE_HINT,
      ].join("\n");
    } else if (LOCAL_BIRTH_TOOLS.has(intent.tool) && !profile) {
      content = [
        `「${toolLabel(intent.tool)}」需要出生信息。`,
        "",
        "请先到「我的 → 命主档案」建一个档案，再回来问。",
      ].join("\n");
    } else {
      const args = localToolArgs(intent.tool, text, profile);
      const meta = getToolMeta(intent.tool);
      const card = document.createElement("div");
      card.className = "chat-tool-card is-running";
      card.innerHTML = `
        <span class="chat-tool-icon" style="--card-tint:${meta.tint};--card-ink:${meta.ink}">${escapeHtml(meta.icon)}</span>
        <span class="chat-tool-name">${escapeHtml(toolLabel(intent.tool))}</span>
        <span class="chat-tool-state">排盘中…</span>
      `;
      liveTools.appendChild(card);
      scrollChatToEnd();

      const result = await callToolApi(intent.tool, args);
      card.classList.remove("is-running");
      const stateEl = card.querySelector(".chat-tool-state");
      if (stateEl) stateEl.textContent = "已排盘";

      content = `${localReadingFor(intent.tool, args, result)}\n\n本地模式说明：以上内容由本地规则依据计算结果生成，未调用模型。${LOCAL_UPGRADE_HINT}`;
      trace = [{ name: intent.tool, ok: true, text: result.text }];
    }
  } catch (error) {
    content = `本地排盘没能完成：${error.message}`;
  } finally {
    liveBody.innerHTML = renderMarkdown(content);
    const log = getChatLog();
    log.push({
      role: "assistant",
      content,
      raw: trace.length
        ? `【排盘结果 · ${toolLabel(trace[0].name)}】\n${trace[0].text}\n\n【解读】\n${content}`
        : content,
      tools: trace,
      local: true,
      time: new Date().toISOString(),
    });
    saveChatLog(log);
    chatBusy = false;
    render();
    scrollChatToEnd();
  }
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
    "你是“赛博玄学”的今日报告解读助手。下面给出的是由黄历计算引擎严格计算得出的“今日计算结果”（JSON 数据）。",
    "",
    "【硬性要求】",
    "1. 只能解释计算结果中出现的内容；计算结果里没有的信息，一律不得编造、推测或补充。",
    "2. 每条建议都必须能在计算结果中找到依据，并明确写出依据（例如“今日宜出行，所以……”）。",
    "3. 穿搭颜色只能基于“当日五行”推导，五行→传统配色映射为：金→白/银/金，木→绿/青，水→黑/蓝，火→红/紫，土→黄/棕。必须说明这是传统五行配色参考，不是确定预测。没有天气数据，不要提天气。",
    "4. 计算结果里没有的具体时间点、具体事件等信息不要编造。",
    "5. 计算结果里没有的内容直接不提，不要写“无法确定”“未给出”这类话。",
    "6. 不做医疗、投资、法律等决策建议。",
    "7. 结尾提醒仅供传统文化研究与娱乐参考。",
    "",
    "【输出格式】（必须严格遵循，每次输出结构完全一致）",
    "1. 用 Markdown 小节标题分节，小节标题固定为：## 今日概要、## 宜忌与行事、## 吉时与方位、## 穿搭与颜色、## 今日提醒、## 温馨提示，顺序与标题文字不得更改或增减。",
    "2. 各小节内容要求：",
    "   - 今日概要：2~3 句话总结今日整体基调，必须提到今日日主（五行）与流日十神。",
    "   - 宜忌与行事：分“宜”“忌”两段，用“- ”列表逐条列出，每条写明依据。",
    "   - 吉时与方位：列出计算结果中的吉时（带具体钟点），以及有利方位。",
    "   - 穿搭与颜色：基于当日五行给出配色建议，并说明是传统五行配色参考。",
    "   - 今日提醒：基于彭祖百忌、冲煞、凶煞等给出注意事项。",
    "   - 温馨提示：提醒仅供传统文化研究与娱乐参考。",
    "3. 正文开头直接是“## 今日概要”，不要输出任何开场白、解释或前缀。",
    "",
    "【今日计算结果】",
    JSON.stringify(buildDailyAiData(report), null, 2),
  ].join("\n");
}

async function callAiDailyReport(report, onDelta) {
  const data = buildDailyAiData(report);
  const draft = await streamAiReport(
    buildDailyAiSystemPrompt(report),
    "请根据上面的计算结果，生成今日报告解读。\n\n请严格按上述输出格式输出，不要改动小节标题。",
    onDelta
  );
  // 本地规则校验替代在线二次 AI 校验：快、免费、无断流风险
  return localValidateDailyText(data, draft);
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
      "chat"
    );
  }

  if (state.reportError) {
    return renderShell(
      `
        <h1 class="page-heading">今日报告</h1>
        <div class="error-box">${escapeHtml(state.reportError)}</div>
        <button class="primary-button" data-action="retry-report">重新生成</button>
      `,
      "chat"
    );
  }

  const cache = getDailyReportCache(active);
  if (!cache || state.reportLoading) {
    return renderShell(
      `
        <h1 class="page-heading">今日报告</h1>
        <div class="loading-box panel"><div><div class="spinner"></div><div>正在生成今日报告...</div></div></div>
      `,
      "chat"
    );
  }

  const report = cache.report;
  return renderShell(
    `
      <div class="result-toolbar">
        <button class="secondary-button" data-action="home">返回对话</button>
        <button class="secondary-button" data-action="retry-report">重新生成</button>
      </div>
      <h1 class="page-heading">今日报告</h1>
      <p class="page-subtitle">${escapeHtml(profileSummary(active))} · ${escapeHtml(report.date)}</p>
      ${renderAlmanacBox(report.almanac)}
      ${renderDailyAiSection(report)}
      <p class="disclaimer">本工具仅供传统文化研究与娱乐参考，不构成任何决策建议。</p>
    `,
    "chat"
  );
}

function renderDailyAiSection(report) {
  const hasKey = aiEnabled();
  const ai = report.ai;
  const aiLoading = report.aiLoading;
  const aiError = report.aiError || "";

  let body;
  if (!hasKey) {
    body = `
      <div class="result-text markdown-render">${renderMarkdown(buildLocalDailyReading(report))}</div>
      ${localReadingHintBlock()}
    `;
  } else if (aiLoading) {
    body = `
      <div class="streaming-box panel">
        <div class="streaming-hint"><span class="spinner"></span>正在生成今日解读…</div>
        <div class="result-text" data-ai-stream-box></div>
      </div>
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
          <p class="page-subtitle">${escapeHtml(aiModeSubtitle())}</p>
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

  // 中断超时判定：页面被系统杀掉后 aiLoading 会残留 true，超过时限标记为中断，交由用户手动重试
  if (cache && cache.report.aiLoading) {
    const gen = getGenState(active);
    if (gen && gen.state === "generating" && Date.now() - gen.at > GEN_TIMEOUT_MS) {
      cache.report.aiLoading = false;
      cache.report.aiError = "上次生成过程中断，请重试";
      saveDailyReportCache(active, cache.report);
      setGenState(active, "error");
    }
  }

  // 仅在无 AI 结果且未失败时自动生成；失败/中断后由用户手动重试，避免无限重试循环
  if (cache && !cache.report.ai && !cache.report.aiLoading && !cache.report.aiError) {
    beginStreamingReport(active);
  }
}

// 生成状态持久化：记录任务状态与开始时间，页面关闭/熄屏恢复后可判断「是继续还是重来」
const GEN_STATE_KEY = (profile, date) => `taibu:genState:${profile.id}:${date}`;
const GEN_TIMEOUT_MS = 3 * 60 * 1000; // 超过 3 分钟仍无完成标记视为中断

function getGenState(profile) {
  try {
    return JSON.parse(localStorage.getItem(GEN_STATE_KEY(profile, todayString())) || "null");
  } catch {
    return null;
  }
}

function setGenState(profile, state) {
  try {
    localStorage.setItem(
      GEN_STATE_KEY(profile, todayString()),
      JSON.stringify({ state, at: Date.now() })
    );
  } catch {
    // 存储失败仅影响恢复判断，不阻断生成。
  }
}

let streamActive = false;

async function beginStreamingReport(profile, force = false) {
  if (streamActive) return;
  const cache = getDailyReportCache(profile);
  if (!cache) return;
  const settings = getAiSettings();
  if (!aiEnabled()) return;

  const partial = force ? "" : cache.report.aiStreamPartial || "";
  cache.report.aiLoading = true;
  cache.report.aiError = "";
  cache.report.aiStreamPartial = partial;
  saveDailyReportCache(profile, cache.report);
  setGenState(profile, "generating");
  streamActive = true;
  setNativeGenerating(true);
  render();

  const box = document.querySelector("[data-ai-stream-box]");
  if (box) box.textContent = partial;
  let full = partial;
  let lastPersistAt = 0;

  try {
    const aiText = await callAiDailyReport(
      { ...cache.report, aiStreamPartial: partial },
      (delta) => {
        full += delta;
        if (box) box.textContent = full;
        const now = Date.now();
        if (now - lastPersistAt > 400) {
          lastPersistAt = now;
          const cur = getDailyReportCache(profile);
          if (cur) {
            cur.report.aiStreamPartial = full;
            saveDailyReportCache(profile, cur.report);
          }
        }
      }
    );
    const updated = getDailyReportCache(profile);
    if (updated) {
      updated.report.ai = { text: aiText, time: new Date().toISOString() };
      updated.report.aiLoading = false;
      updated.report.aiError = "";
      delete updated.report.aiStreamPartial;
      saveDailyReportCache(profile, updated.report);
    }
    setGenState(profile, "done");
  } catch (error) {
    const updated = getDailyReportCache(profile);
    // 免费体验用完：不留报错，界面自动落回本地解读
    if (isRelayProvider(settings) && isRelayBlockError(error)) {
      markRelayExhausted();
      if (updated) {
        updated.report.aiLoading = false;
        updated.report.aiError = "";
        delete updated.report.aiStreamPartial;
        saveDailyReportCache(profile, updated.report);
      }
      setGenState(profile, "done");
      return;
    }
    if (updated) {
      updated.report.aiLoading = false;
      updated.report.aiError = error.message;
      saveDailyReportCache(profile, updated.report);
    }
    setGenState(profile, "error");
  } finally {
    streamActive = false;
    setNativeGenerating(false);
    render();
  }
}

function regenerateDailyAi() {
  const active = getActiveProfile();
  if (!active) return;
  const cache = getDailyReportCache(active);
  if (!cache) return;
  cache.report.ai = null;
  cache.report.aiError = "";
  cache.report.aiStreamPartial = "";
  saveDailyReportCache(active, cache.report);
  beginStreamingReport(active, true);
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
  // 出生时辰用十二时辰下拉，比填 0-23 的数字更省事
  if (fieldKey === "birthHour") return renderShichenField(fieldKey, defaultValueFor(fieldKey, schema));
  const type = inputTypeFor(fieldKey, schema, toolName);
  const value = defaultValueFor(fieldKey, schema);
  const label = LABELS[fieldKey] || fieldKey;
  const required = schema.required === true;
  const hint = schema.description
    ? `<p class="field-hint">${escapeHtml(translateHint(schema.description))}</p>`
    : "";
  const wide = fieldKey === "question" || fieldKey === "numbers" || fieldKey === "queries" || fieldKey === "birthPlace" || schema.type === "object";
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
  const groupedFields = {};
  const ungroupedFields = [];
  const advancedFields = [];
  for (const [key, schema] of Object.entries(properties)) {
    const normalizedSchema = { ...schema, required: required.includes(key) };
    if (ADVANCED_FIELDS.includes(key)) {
      advancedFields.push(renderField(key, normalizedSchema, toolName));
      continue;
    }
    const group = FIELD_GROUPS.find((g) => g.fields.includes(key));
    const html = renderField(key, normalizedSchema, toolName);
    if (group) {
      if (!groupedFields[group.key]) groupedFields[group.key] = [];
      groupedFields[group.key].push({ key, html });
    } else {
      ungroupedFields.push(html);
    }
  }

  // 一键排盘：工具以出生信息为主输入、且已有档案时，出生信息折叠为摘要条
  const usesBirth = Boolean(properties.birthYear);
  const quickReady = Boolean(usesBirth && active);

  // 档案齐全时隐藏出生信息分组，用摘要条展示"已带入"，只留需要输入的窗口
  const hiddenGroups = quickReady ? ["birth", "place"] : [];
  const visibleGroups = FIELD_GROUPS.filter((g) => groupedFields[g.key] && groupedFields[g.key].length);
  const numeralFor = (key) => GROUP_NUMERALS[visibleGroups.filter((g) => !hiddenGroups.includes(g.key)).findIndex((g) => g.key === key)] || "";

  // 出生年月日挤在一行，其余字段走两列栅格
  const DATE_ROW_KEYS = ["birthYear", "birthMonth", "birthDay"];
  const renderGroupGrid = (groupKey, items) => {
    if (groupKey !== "birth") return `<div class="form-grid">${items.map((item) => item.html).join("")}</div>`;
    const dateItems = DATE_ROW_KEYS.map((k) => items.find((item) => item.key === k)).filter(Boolean);
    const rest = items.filter((item) => !DATE_ROW_KEYS.includes(item.key));
    const dateRow = dateItems.length
      ? `<div class="field-row field-row-3">${dateItems.map((item) => item.html).join("")}</div>`
      : "";
    return `<div class="form-grid">${dateRow}${rest.map((item) => item.html).join("")}</div>`;
  };

  const groupHtml = FIELD_GROUPS.filter((g) => groupedFields[g.key] && groupedFields[g.key].length)
    .map(
      (g) => `
        <div class="form-group${hiddenGroups.includes(g.key) ? " is-hidden" : ""}" data-group="${g.key}">
          <div class="form-group-title"><span class="form-group-index" aria-hidden="true">${numeralFor(g.key)}</span>${escapeHtml(g.label)}</div>
          ${renderGroupGrid(g.key, groupedFields[g.key])}
        </div>
      `
    )
    .join("");

  const prefillBar = quickReady
    ? `
      <div class="profile-prefill" data-prefill-bar>
        <div class="profile-prefill-info">
          <span class="profile-prefill-label">已带入</span>
          <strong>${escapeHtml(active.name)}</strong>
          <span>${escapeHtml(profileDetail(active))}</span>
        </div>
        <div class="profile-prefill-actions">
          <button type="button" class="secondary-button" data-action="edit-birth">修改资料</button>
          <button type="button" class="secondary-button" data-action="reveal-form">为他人排盘</button>
        </div>
      </div>
    `
    : "";
  const ungroupedHtml = ungroupedFields.length ? `<div class="form-grid">${ungroupedFields.join("")}</div>` : "";

  const advancedHtml = advancedFields.length
    ? `
        <details class="details-box">
          <summary>高级设置（可选）</summary>
          <div class="form-grid" style="margin-top:10px">${advancedFields.join("")}</div>
        </details>
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
      <button class="secondary-button" data-action="tools">返回工具</button>
      <div class="section-heading">
        <div>
          <h1 class="page-heading">${escapeHtml(toolLabel(toolName))}</h1>
          <p class="page-subtitle">${escapeHtml(tool.description || "")}</p>
        </div>
        <span class="tool-icon" style="--card-tint:${meta.tint};--card-ink:${meta.ink}">${escapeHtml(meta.icon)}</span>
      </div>
      ${prefillBar}
      <form class="form-panel panel" data-tool-form="${escapeHtml(toolName)}">
        ${groupHtml}${ungroupedHtml}
        ${advancedHtml}
        ${saveRow}
        <div class="form-actions">
          <button type="button" class="secondary-button" data-action="tools">取消</button>
          <button type="submit" class="primary-button">开始排盘</button>
        </div>
        <div class="error-box is-hidden" data-form-error></div>
      </form>
    `,
    "tools"
  );
}

// 展开"已带入"的出生信息分组；clearValues 为 true 时同时清空档案值（为他人排盘）
function revealBirthGroups(clearValues) {
  const form = document.querySelector("[data-tool-form]");
  if (!form) return;
  form.querySelectorAll('.form-group[data-group="birth"], .form-group[data-group="place"]').forEach((group) => {
    group.classList.remove("is-hidden");
  });
  const bar = document.querySelector("[data-prefill-bar]");
  if (bar) bar.classList.add("is-hidden");
  if (clearValues) {
    const birthFields = ["gender", "birthYear", "birthMonth", "birthDay", "birthHour", "birthMinute", "calendarType", "isLeapMonth", "birthPlace", "longitude", "latitude"];
    form.querySelectorAll("[data-field]").forEach((field) => {
      if (!birthFields.includes(field.dataset.field)) return;
      if (field.type === "checkbox") {
        field.checked = false;
      } else if (field.tagName === "SELECT") {
        // 下拉不能清成空值，回到第一项（公历 / 子时 等）
        field.selectedIndex = 0;
      } else {
        field.value = "";
      }
    });
  }
  form.scrollIntoView({ behavior: "smooth", block: "start" });
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
    if (key === "birthHour" || key === "birthMinute") {
      // 时辰/分钟可能是下拉或数字框，统一转成数字
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
        <button class="secondary-button" data-action="tools">返回工具</button>
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
  const hasKey = aiEnabled();
  const chat = getChatMessages(item);
  const chatHtml = chat
    .map(
      (message, index) => `
        <div class="chat-message ${message.role === "user" ? "user" : "assistant"}">
          <div class="chat-message-label">${message.role === "user" ? "你" : "玄学助手"}</div>
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
      <div class="result-text markdown-render">${renderMarkdown(buildLocalToolReading(toolName, item))}</div>
      ${localReadingHintBlock()}
    `;

  return `
    <section class="panel result-panel ai-panel">
      <div class="section-heading">
        <div>
          <h2>${hasKey ? "智能对话" : "本地解读"}</h2>
          <p class="page-subtitle">${
            hasKey
              ? "密钥只保存在本机，不会写入 APK 文件或发送到服务器。"
              : "不调用模型，全部内容由本地规则依据排盘结果生成。"
          }</p>
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
    : `<div class="empty-box panel"><div><p>暂无历史记录。</p><button class="primary-button" data-action="tools">去选择工具</button></div></div>`;

  return renderShell(
    `
      <h1 class="page-heading">历史记录</h1>
      <p class="page-subtitle">记录仅保存在当前浏览器本地。</p>
      <div class="history-list">${items}</div>
    `,
    "mine"
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
    throw new Error("不是赛博玄学的备份文件");
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

// 「我的」页档案编辑器的展开状态：null=收起，"edit"=编辑当前，"new"=新建
let mineFormMode = null;

function renderMinePage() {
  const profiles = getProfiles();
  const active = getActiveProfile();
  const settings = getAiSettings();
  const hasProfile = Boolean(active);
  const creating = mineFormMode === "new";
  const formOpen = mineFormMode !== null || !hasProfile;
  const p = creating ? {} : active || {};
  const val = (key) => escapeHtml(p[key] !== undefined && p[key] !== null ? String(p[key]) : "");

  const profileForm = `
    <form class="form-panel panel" data-mine-profile-form>
      <input type="hidden" data-mine-edit-id value="${creating ? "" : val("id")}" />
      <div class="form-grid">
        <div class="field field-wide">
          <label for="mine-name">姓名 / 称呼</label>
          <input id="mine-name" data-mine-name value="${val("name")}" placeholder="如：张三" />
        </div>
        <div class="field-row field-row-3">
          <div class="field">
            <label for="mine-birth-year">出生年</label>
            <input id="mine-birth-year" type="number" inputmode="numeric" data-field="birthYear" value="${val("birthYear")}" min="1900" max="2100" />
          </div>
          <div class="field">
            <label for="mine-birth-month">出生月</label>
            <input id="mine-birth-month" type="number" inputmode="numeric" data-field="birthMonth" value="${val("birthMonth")}" min="1" max="12" />
          </div>
          <div class="field">
            <label for="mine-birth-day">出生日</label>
            <input id="mine-birth-day" type="number" inputmode="numeric" data-field="birthDay" value="${val("birthDay")}" min="1" max="31" />
          </div>
        </div>
        <div class="field">
          <label for="mine-gender">性别</label>
          <select id="mine-gender" data-field="gender">
            <option value="male" ${p.gender !== "female" ? "selected" : ""}>男</option>
            <option value="female" ${p.gender === "female" ? "selected" : ""}>女</option>
          </select>
        </div>
        <div class="field">
          <label for="mine-calendar">历法</label>
          <select id="mine-calendar" data-field="calendarType">
            <option value="solar" ${p.calendarType !== "lunar" ? "selected" : ""}>公历</option>
            <option value="lunar" ${p.calendarType === "lunar" ? "selected" : ""}>农历</option>
          </select>
        </div>
        ${renderShichenField("birthHour", p.birthHour ?? 12)}
        <div class="field">
          <label for="mine-place">出生地点</label>
          <input id="mine-place" data-field="birthPlace" value="${val("birthPlace")}" placeholder="如：北京市（可选）" />
        </div>
      </div>
      <details class="details-box">
        <summary>高级设置（可选）</summary>
        <div class="form-grid" style="margin-top:10px">
          <div class="field">
            <label for="mine-birth-minute">出生分（精确到分）</label>
            <input id="mine-birth-minute" type="number" inputmode="numeric" data-field="birthMinute" value="${val("birthMinute")}" min="0" max="59" />
          </div>
          <div class="field">
            <div class="toggle-field">
              <label for="mine-leap">农历闰月</label>
              <input id="mine-leap" data-field="isLeapMonth" type="checkbox" ${p.isLeapMonth ? "checked" : ""} />
            </div>
          </div>
          <div class="field">
            <label for="mine-lng">经度（可选）</label>
            <input id="mine-lng" type="number" step="0.0001" data-field="longitude" value="${val("longitude")}" />
          </div>
          <div class="field">
            <label for="mine-lat">纬度（可选）</label>
            <input id="mine-lat" type="number" step="0.0001" data-field="latitude" value="${val("latitude")}" />
          </div>
        </div>
      </details>
      <div class="form-actions">
        <button class="secondary-button" type="button" data-action="mine-cancel-profile">取消</button>
        <button class="primary-button" type="submit">${hasProfile && !creating ? "保存修改" : "保存档案"}</button>
      </div>
      <div class="error-box is-hidden" data-mine-error></div>
    </form>
  `;

  const profileCard = `
    <div class="profile-card${formOpen ? " is-open" : ""}">
      <span class="profile-card-avatar" aria-hidden="true">${hasProfile ? escapeHtml((active.name || "档").trim().slice(0, 1)) : "＋"}</span>
      <div class="profile-card-body">
        <div class="profile-card-name">${hasProfile ? escapeHtml(active.name) : "还没有个人档案"}</div>
        <div class="profile-card-meta">${hasProfile ? escapeHtml(profileDetail(active)) : "填一次出生信息，之后排盘自动带入。"}</div>
      </div>
      <div class="profile-card-actions">
        ${hasProfile ? `<button class="secondary-button" type="button" data-action="mine-toggle-profile">${formOpen ? "收起" : "编辑"}</button>` : ""}
        ${hasProfile && !creating ? `<button class="secondary-button" type="button" data-action="mine-new-profile">新建</button>` : ""}
      </div>
    </div>
  `;

  const profileEditor = `<div class="profile-editor${formOpen ? " is-open" : ""}">${profileForm}</div>`;

  const others = profiles.filter((profile) => !active || profile.id !== active.id);
  const profileList = others.length
    ? `
      <div class="profile-others">
        <p class="profile-others-title">其他档案</p>
        ${others
          .map(
            (profile) => `
            <div class="panel profile-list-item">
              <div>
                <strong>${escapeHtml(profile.name)}</strong>
                <p>${escapeHtml(profileSummary(profile))}</p>
              </div>
              <div class="profile-list-actions">
                <button class="secondary-button" data-action="set-profile" data-profile-id="${escapeHtml(profile.id)}">设为当前</button>
                <button class="secondary-button" data-action="delete-profile" data-profile-id="${escapeHtml(profile.id)}">删除</button>
              </div>
            </div>
          `
          )
          .join("")}
      </div>
    `
    : "";

  const history = getHistory();
  const historyPreview = history.length
    ? history
        .slice(0, 5)
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
    : `<p class="mine-empty">暂无历史记录。</p>`;

  const providerOptions = AI_PROVIDER_ORDER.filter((key) => AI_PROVIDERS[key])
    .map(
      (key) =>
        `<option value="${escapeHtml(key)}" ${settings.provider === key ? "selected" : ""}>${escapeHtml(AI_PROVIDERS[key].label)}</option>`
    )
    .join("");
  const current = AI_PROVIDERS[settings.provider] || AI_PROVIDERS.deepseek;
  const relayActive = isRelayProvider(settings);
  const modelList = current.models && current.models.length ? current.models : [{ model: current.model, label: current.model }];
  const activeModel = current.models && current.models.some((m) => m.model === settings.model)
    ? settings.model
    : current.model;
  const modelOptions = modelList
    .map(
      (m) =>
        `<option value="${escapeHtml(m.model)}" ${m.model === activeModel ? "selected" : ""}>${escapeHtml(m.label)}</option>`
    )
    .join("");

  return renderShell(
    `
      <h1 class="page-heading">我的</h1>
      <p class="page-subtitle">个人档案、历史记录、模型设置与数据备份。档案只保存在本机。</p>

      <div class="section-heading"><h2>个人档案</h2></div>
      ${profileCard}
      ${profileEditor}
      ${profileList}

      <div class="section-heading"><h2>历史记录</h2>${history.length ? `<button class="secondary-button mine-more" data-action="history">查看全部</button>` : ""}</div>
      <div class="history-list">${historyPreview}</div>

      <div class="section-heading"><h2>AI 模型</h2></div>
      <form class="form-panel panel" data-ai-settings-form>
        <div class="form-grid">
          <div class="field">
            <label for="ai-provider">提供商</label>
            <select id="ai-provider" data-ai-provider>${providerOptions}</select>
            <label for="ai-model" style="display:block;margin-top:12px">具体模型</label>
            <select id="ai-model" data-ai-model>${modelOptions}</select>
            <p class="field-hint" data-ai-base-hint>接口：${escapeHtml(current.baseUrl)}</p>
          </div>
          <div class="field ${relayActive ? "is-hidden" : ""}" data-ai-key-field>
            <label for="ai-key">接口密钥</label>
            <input id="ai-key" data-ai-key type="password" value="${escapeHtml(settings.apiKey)}" placeholder="sk-..." />
            <p class="field-hint">密钥只保存在本机，不会随 APK 传播。</p>
          </div>
        </div>
        ${
          relayActive
            ? `
        <div class="relay-quota-box" data-relay-box>
          <p><strong>免费体验</strong> · ${escapeHtml(relayQuotaText())}</p>
          <p class="field-hint">无需填写密钥，装好就能用。次数用完后，在这里换成自己的 DeepSeek / 小米 MiMo 密钥即可继续。</p>
          <button class="secondary-button" type="button" data-action="relay-refresh">刷新剩余次数</button>
        </div>
        `
            : AI_PROVIDERS.relay
              ? `<p class="field-hint">还没有密钥？把上面的「提供商」改成「免费体验」，不填密钥也能直接用。</p>`
              : ""
        }
        <div class="form-actions">
          <button class="primary-button" type="submit">保存设置</button>
        </div>
        <div class="error-box is-hidden" data-ai-settings-error></div>
      </form>

      <div class="section-heading"><h2>外观</h2></div>
      <section class="panel theme-panel">
        <p>深色为默认主题，夜间更省眼；白天可切浅色。</p>
        <div class="theme-switch" role="group" aria-label="主题模式">
          ${THEMES.map(
            (theme) => `
            <button type="button" data-action="set-theme" data-theme="${theme.id}" class="${getThemeId() === theme.id ? "is-active" : ""}" aria-pressed="${getThemeId() === theme.id}">${theme.label}</button>
          `
          ).join("")}
        </div>
      </section>

      <div class="section-heading"><h2>数据备份</h2></div>
      <section class="panel backup-panel">
        <p>导出全部档案、历史记录与模型密钥设置，或从备份文件恢复。建议定期备份，防止清除浏览器数据导致丢失。</p>
        <div class="backup-actions">
          <button class="secondary-button" data-action="export-data">导出数据</button>
          <button class="secondary-button" data-action="import-data">导入数据</button>
          <input type="file" accept="application/json,.json" data-import-file class="is-hidden" />
        </div>
        <p class="backup-status is-hidden" data-backup-status></p>
      </section>

      ${window.AndroidBridge
        ? `
      <div class="section-heading"><h2>关于</h2></div>
      <section class="panel backup-panel">
        <p>当前版本 v${escapeHtml(window.AndroidBridge.getVersionName())} · 赛博玄学</p>
        <div class="backup-actions">
          <button class="secondary-button" data-action="check-update">检查更新</button>
        </div>
      </section>
      `
        : ""}
    `,
    "mine"
  );
}

function saveMineProfile(form) {
  const errorBox = form.querySelector("[data-mine-error]");
  const name = form.querySelector("[data-mine-name]")?.value.trim() || "";
  if (!name) {
    if (errorBox) {
      errorBox.textContent = "请先填写姓名或称呼，方便区分多个档案。";
      errorBox.classList.remove("is-hidden");
    }
    form.querySelector("[data-mine-name]")?.focus();
    return;
  }
  const request = collectFormValues(form);
  const editId = form.querySelector("[data-mine-edit-id]")?.value || "";
  const existing = getProfiles().find((item) => item.id === editId) || null;
  const profile = profileFromRequest(name, request, existing);
  const profiles = getProfiles().filter((item) => item.id !== profile.id);
  profiles.push(profile);
  saveProfiles(profiles);
  setActiveProfile(profile.id);
  mineFormMode = null;
  render();
}

function saveAiSettingsPageFromPage(form) {
  const provider = form.querySelector("[data-ai-provider]")?.value || "deepseek";
  const model = form.querySelector("[data-ai-model]")?.value || "";
  const apiKey = form.querySelector("[data-ai-key]")?.value || "";
  const config = AI_PROVIDERS[provider] || AI_PROVIDERS.deepseek;
  saveAiSettings({ provider, apiKey, model: model || config.model, baseUrl: config.baseUrl });
  if (config.relay) {
    // 切到免费体验时顺手校准一次剩余次数
    refreshRelayQuota().then(() => render());
    return;
  }
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
    // 免费体验用完：整页重绘后会自动变成本地解读
    if (isRelayProvider(getAiSettings()) && isRelayBlockError(error)) {
      markRelayExhausted();
      render();
      return;
    }
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
  link.download = "赛博玄学报告.txt";
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
  } else if (first === "chats") {
    content = renderChatSessions();
  } else if (first === "profiles" || first === "ai") {
    content = renderMinePage();
  } else if (first === "report") {
    content = renderDailyReport();
  } else if (first === "tools") {
    content = renderToolsPage();
  } else {
    content = renderChat();
  }

  app.innerHTML = content;
  syncTopbarHeight();
  bindEvents();
  // 生成中重绘（如免费额度刷新）会把输入区恢复成可点状态，这里补回来
  if (chatBusy) setChatComposerBusy(true);
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
      } else if (action === "chat") {
        window.location.hash = "#/";
      } else if (action === "tools") {
        window.location.hash = "#/tools";
      } else if (action === "chat-voice") {
        startVoiceInput();
      } else if (action === "chat-send") {
        const input = app.querySelector("[data-chat-main]");
        const text = input?.value.trim() || "";
        if (input) input.value = "";
        sendChatMessage(text);
      } else if (action === "chat-chip") {
        closeChatSheet();
        sendChatMessage(element.dataset.text || "");
      } else if (action === "chat-sheet") {
        const sheet = app.querySelector("[data-chat-sheet]");
        if (sheet) sheet.hidden = false;
      } else if (action === "chat-sheet-close") {
        closeChatSheet();
      } else if (action === "chat-retry") {
        retryChatTurn(element.dataset.id || "");
      } else if (action === "chat-history") {
        window.location.hash = "#/chats";
      } else if (action === "chat-new") {
        startNewChat();
        if (window.location.hash === "#/" || window.location.hash === "") {
          render();
        } else {
          window.location.hash = "#/";
        }
      } else if (action === "open-chat") {
        setActiveChatId(element.dataset.id || "");
        window.location.hash = "#/";
        render();
      } else if (action === "delete-chat") {
        const id = element.dataset.id || "";
        if (window.confirm("确定删除这段对话吗？删除后无法恢复。")) {
          deleteChatSession(id);
          render();
        }
      } else if (action === "history") {
        window.location.hash = "#/history";
      } else if (action === "profiles") {
        window.location.hash = "#/ai";
      } else if (action === "ai-settings") {
        window.location.hash = "#/ai";
      } else if (action === "report") {
        window.location.hash = "#/report";
      } else if (action === "retry-report") {
        retryDailyReport();
      } else if (action === "ai-report-regenerate") {
        regenerateDailyAi();
      } else if (action === "relay-refresh") {
        refreshRelayQuota().then(() => render());
      } else if (action === "tool") {
        window.location.hash = `#/tool/${encodeURIComponent(tool)}`;
      } else if (action === "edit-birth") {
        revealBirthGroups(false);
      } else if (action === "reveal-form") {
        revealBirthGroups(true);
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
      } else if (action === "mine-toggle-profile") {
        mineFormMode = mineFormMode === null ? "edit" : null;
        render();
      } else if (action === "mine-new-profile") {
        mineFormMode = "new";
        render();
      } else if (action === "mine-cancel-profile") {
        mineFormMode = null;
        render();
      } else if (action === "set-profile") {
        setActiveProfile(element.dataset.profileId);
        mineFormMode = null;
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
          mineFormMode = null;
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
      } else if (action === "font-menu") {
        toggleFontMenu(element);
      } else if (action === "set-font") {
        setFontScale(element.dataset.font);
      } else if (action === "set-theme") {
        applyTheme(element.dataset.theme);
        render();
      } else if (action === "check-update") {
        try {
          window.AndroidBridge?.checkForUpdateManual();
        } catch (error) {
          // 非 APK 环境不会出现该按钮。
        }
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

  app.querySelectorAll("[data-mine-profile-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveMineProfile(form);
    });
  });

  app.querySelectorAll("[data-ai-provider]").forEach((select) => {
    select.addEventListener("change", () => {
      const config = AI_PROVIDERS[select.value];
      const hint = select.parentElement?.querySelector("[data-ai-base-hint]");
      const modelSelect = select.parentElement?.querySelector("[data-ai-model]");
      const keyField = select.closest("form")?.querySelector("[data-ai-key-field]");
      if (config) {
        if (modelSelect) {
          const models = config.models && config.models.length ? config.models : [{ model: config.model, label: config.model }];
          modelSelect.innerHTML = models
            .map((m) => `<option value="${escapeHtml(m.model)}">${escapeHtml(m.label)}</option>`)
            .join("");
        }
        if (hint) {
          hint.textContent = config.relay ? "接口：由太卜中转服务提供，无需密钥" : `接口：${config.baseUrl}`;
        }
        if (keyField) keyField.classList.toggle("is-hidden", Boolean(config.relay));
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

  const chatInput = app.querySelector("[data-chat-main]");
  if (chatInput) {
    const autoGrow = () => {
      chatInput.style.height = "auto";
      chatInput.style.height = `${Math.min(chatInput.scrollHeight, 140)}px`;
    };
    chatInput.addEventListener("input", autoGrow);
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = "";
        autoGrow();
        sendChatMessage(text);
      }
    });
    if (window.matchMedia("(min-width: 768px)").matches) chatInput.focus();
  }
  // 重新渲染会重建输入区，正在聆听时恢复按钮与提示文案
  if (voiceListening) setVoiceListening(true);
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
  initVoiceBridge();
  // 启动即开一段新对话：旧对话留在「历史」里，不会被一次性铺满整屏。
  // 但上次生成被中断（切后台/熄屏/WebView 被回收）时留在原会话，
  // 让用户看到已生成的部分并点「重新生成」，而不是直接换到空白新会话。
  migrateLegacyChat();
  // 上一轮被中断时留在原会话（不换新会话），并重绘一次让「重新生成」按钮出现
  if (finalizeStaleTurns()) render();
  else startNewChat();
  // 后台校准免费体验剩余次数：额度跨月恢复或换设备后，本地状态要跟着更新
  if (AI_PROVIDERS.relay) {
    refreshRelayQuota().then((quota) => {
      if (quota) render();
    });
  }
  // 启动即应用已保存的字号偏好，避免首屏闪动
  document.documentElement.dataset.font = getFontScaleId();
  // 同步已保存主题（含 theme-color），首屏底色由 index.html 内联脚本先行落地
  applyTheme(getThemeId());
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".font-menu-anchor")) closeFontMenu();
  });
  // 字号切换/旋屏都会改变顶栏高度，吸顶偏移要跟着更新
  window.addEventListener("resize", syncTopbarHeight);
  // 键盘弹起/收起：resize 覆盖 WebView，visualViewport 覆盖浏览器，focusin/focusout 兜住高度没变的机型
  window.addEventListener("resize", syncKeyboardState);
  window.visualViewport?.addEventListener("resize", syncKeyboardState);
  document.addEventListener("focusin", syncKeyboardState);
  document.addEventListener("focusout", () => setTimeout(syncKeyboardState, 0));
  syncKeyboardState();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // 熄屏/切后台前把已生成部分落地，避免中断丢数据
      persistChatTurnPartial();
      const active = getActiveProfile();
      if (active) {
        const cache = getDailyReportCache(active);
        if (cache && cache.report.aiStreamPartial) {
          saveDailyReportCache(active, cache.report);
        }
      }
      return;
    }
    // 回到前台时留在当前页，仅刷新缓存状态（报告中断会显示可重试，不再强制跳首页）
    // 对话生成中不重渲染，避免打断流式输出
    if (!chatBusy) render();
  });
}

// 主题（深色默认 / 浅色可切）；首屏由 index.html 内联脚本先落地，避免闪白
const THEME_KEY = "taibu:theme";
const THEMES = [
  { id: "dark", label: "深色" },
  { id: "light", label: "浅色" },
];

function getThemeId() {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch (error) {
    return "dark";
  }
}

function applyTheme(id) {
  const theme = id === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  const bg = theme === "light" ? "#F4F6FA" : "#080B11";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", bg);
  // APK 内同步系统状态栏/导航栏底色，否则深色界面顶上会留一条系统灰条
  try {
    window.AndroidBridge?.setSystemBarColor?.(bg);
  } catch (error) {
    // 浏览器/PWA 没有这个桥接，忽略
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // 隐私模式下写入失败不影响本次切换
  }
}

// 顶栏高度写进 CSS 变量：对话页的「历史 / 新会话」栏靠它吸顶在顶栏正下方
function syncTopbarHeight() {
  const bar = app.querySelector(".topbar");
  if (bar) document.documentElement.style.setProperty("--topbar-h", `${bar.offsetHeight}px`);
}

// 软键盘弹起时，WebView 会直接压缩布局视口，把 position:fixed 的底部导航一起顶上来。
// 这里判断键盘是否弹起，弹起时把底部导航藏到屏幕外，只让输入框贴着键盘上沿。
let viewportBaseHeight = 0;
let viewportBaseWidth = 0;

function hasTextFocus() {
  const element = document.activeElement;
  if (!element) return false;
  return element.tagName === "TEXTAREA" || element.tagName === "INPUT" || element.isContentEditable;
}

function syncKeyboardState() {
  const viewport = window.visualViewport;
  const layoutHeight = window.innerHeight;
  const visibleHeight = viewport ? viewport.height : layoutHeight;

  // 旋屏后可用高度会变，宽度一变就重取基准，免得把横屏误判成键盘弹起
  if (window.innerWidth !== viewportBaseWidth) {
    viewportBaseWidth = window.innerWidth;
    viewportBaseHeight = layoutHeight;
  } else if (layoutHeight > viewportBaseHeight) {
    viewportBaseHeight = layoutHeight;
  }

  // WebView 的 adjustResize 缩短布局视口，浏览器只缩可视视口（捏合缩放也会缩，所以要求输入框处于聚焦态）
  const covered = Math.max(viewportBaseHeight - layoutHeight, layoutHeight - visibleHeight);
  const keyboardOpen = hasTextFocus() && covered > 120;
  document.documentElement.dataset.keyboard = keyboardOpen ? "on" : "off";
  const inset = keyboardOpen ? Math.max(layoutHeight - visibleHeight, 0) : 0;
  document.documentElement.style.setProperty("--kb-inset", `${Math.round(inset)}px`);
}

// 字号调节（大字号模式，老年用户友好；zoom 同步放大文字与点击区域）
const FONT_SCALE_KEY = "taibu:fontScale";
const FONT_SCALES = [
  { id: "normal", label: "标准", zoom: 1 },
  { id: "large", label: "大", zoom: 1.15 },
  { id: "xlarge", label: "特大", zoom: 1.3 },
];

function getFontScaleId() {
  try {
    const saved = localStorage.getItem(FONT_SCALE_KEY);
    return FONT_SCALES.some((s) => s.id === saved) ? saved : "normal";
  } catch (error) {
    return "normal";
  }
}

function applyFontScale(id) {
  if (!FONT_SCALES.some((s) => s.id === id)) return;
  document.documentElement.dataset.font = id;
  try {
    localStorage.setItem(FONT_SCALE_KEY, id);
  } catch (error) {
    // 无痕模式等存储失败时仅本次生效。
  }
}

function toggleFontMenu(button) {
  const menu = button.parentElement.querySelector(".font-menu");
  if (!menu) return;
  menu.hidden = !menu.hidden;
  button.setAttribute("aria-expanded", String(!menu.hidden));
}

function closeFontMenu() {
  const menu = document.querySelector(".font-menu");
  if (menu) menu.hidden = true;
  const toggle = document.querySelector(".font-toggle");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
}

function setFontScale(id) {
  applyFontScale(id);
  document.querySelectorAll(".font-menu [data-font]").forEach((button) => {
    const isActive = button.dataset.font === id;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  closeFontMenu();
}

// 应用内自更新（仅 APK 环境生效，浏览器环境自动跳过）
function initUpdateCheck() {
  if (!window.AndroidBridge) return;
  window.__onUpdateCheck = (info, manual) => {
    try {
      const data = typeof info === "string" ? JSON.parse(info.replace(/^\uFEFF/, "").trim()) : info;
      if (!data || !data.versionCode) {
        if (manual) window.alert("检查失败：无法获取服务器版本信息，请检查网络后重试。");
        return;
      }
      const current = window.AndroidBridge.getVersionCode();
      if (data.versionCode > current) {
        const version = data.versionName ? `v${data.versionName}` : `v${data.versionCode}`;
        const notes = data.notes || "修复了一些问题，建议更新。";
        if (window.confirm(`发现新版本 ${version}\n\n${notes}\n\n是否立即下载并安装？`)) {
          window.AndroidBridge.downloadAndInstall(data.url);
        }
      } else if (manual) {
        window.alert(`当前已是最新版本 v${window.AndroidBridge.getVersionName()}。`);
      }
    } catch (error) {
      if (manual) window.alert("检查失败：版本信息解析异常，请稍后重试。");
    }
  };
  window.__onUpdateDownloadFailed = () => {
    window.alert("更新包下载失败，请检查网络后在“我的 → 检查更新”重试。");
  };
  try {
    window.AndroidBridge.checkForUpdate();
  } catch (error) {
    // 忽略。
  }
}

init();
