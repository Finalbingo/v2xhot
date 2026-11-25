// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * tagColor 是飞书推送卡片里跟在标题后面的这一类小标签的颜色（飞书 text_tag 的颜色名）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "tender", tagColor: "indigo", label: "招标公告", feedLabel: "招标公告", section: "招标公告", guide: "公开招标、邀请招标、竞争性磋商、竞争性谈判、询价、资格预审等采购公告，以及同一项目的变更、澄清、更正、延期、终止/废标公告。重点是车路云一体化、路侧感知、边缘计算、车载终端、云控平台、高精地图、智慧高速与智能网联先导区相关的信息化与智能网联标段；纯土木施工标段不归这里。" },
  { key: "intent", tagColor: "turquoise", label: "采购意向", feedLabel: "采购意向", section: "采购意向", guide: "采购人按规定公开的采购意向与招标计划：预计采购时间、预算金额、需求概况，尚未正式招标。已正式发招标公告的归招标公告。" },
  { key: "award", tagColor: "orange", label: "结果公示", feedLabel: "中标/成交结果", section: "中标/成交结果", guide: "中标/成交结果公告、中标候选人公示、合同公告与验收结果。公布的是谁中了标、中了多少钱，不是再次招标。" },
  { key: "policy", tagColor: "violet", label: "政策试点", feedLabel: "政策与试点", section: "政策与试点", guide: "官方发布的车路云一体化与智能网联汽车政策、试点城市名单、实施方案、技术标准与管理办法。来自政府或主管部门官网，不是媒体解读或行业评论。" },
  { key: "industry", tagColor: "green", label: "项目动态", feedLabel: "项目动态", section: "项目动态", guide: "官方披露的项目建设进展、开工、通车、验收与运营动态，以及行业会议、调研。不含纯土木施工、绿化养护、房建工程，也不含办公耗材、后勤物业与无关信息化维保。" },
] as const satisfies ReadonlyArray<{ key: string; tagColor: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = { category: "tender", tag: "招标公告", unit: "条新招标" };

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["rsu", "obu", "mec", "v2x", "etc", "5g", "ai", "lidar"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["tender_notice", "procurement_intent", "award_result", "policy_pilot", "project_progress", "general_news"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "招标公告", "采购意向", "中标/成交", "变更/澄清", "终止/废标", "政策/试点", "项目动态", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "车路云一体化", "V2X/车路协同", "RSU/路侧单元", "激光雷达", "毫米波雷达", "雷视一体机", "MEC/边缘计算", "OBU/车载终端", "云控平台", "高精地图", "智慧高速", "智能网联先导区", "信号控制",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["河北交投", "中交集团", "中国中铁", "中国铁建", "招商局集团", "交通运输部", "北京车网", "湘江智能"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  招标: "招标公告", 公开招标: "招标公告", 采购公告: "招标公告", 竞争性磋商: "招标公告", 竞争性谈判: "招标公告", 询价: "招标公告", 资格预审: "招标公告", 邀请招标: "招标公告",
  中标: "中标/成交", 成交: "中标/成交", 结果公示: "中标/成交", 中标候选人: "中标/成交", 合同公告: "中标/成交", 验收: "中标/成交",
  变更: "变更/澄清", 澄清: "变更/澄清", 延期: "变更/澄清", 更正: "变更/澄清", 补遗: "变更/澄清",
  终止: "终止/废标", 废标: "终止/废标", 流标: "终止/废标",
  采购意向: "采购意向", 意向公开: "采购意向", 招标计划: "采购意向",
  政策: "政策/试点", 试点: "政策/试点", 实施方案: "政策/试点", 标准: "政策/试点", 管理办法: "政策/试点",
  项目进展: "项目动态", 开工: "项目动态", 通车: "项目动态", 运营: "项目动态", 会议: "项目动态", 调研: "项目动态",
  车路云: "车路云一体化", 车路协同: "V2X/车路协同", 路侧单元: "RSU/路侧单元", 路侧感知: "RSU/路侧单元", 边缘计算: "MEC/边缘计算", 车载终端: "OBU/车载终端", 车载单元: "OBU/车载终端",
  云控基础平台: "云控平台", 智能网联: "智能网联先导区", 先导区: "智能网联先导区", 雷视一体: "雷视一体机", 信控: "信号控制", 信号优化: "信号控制",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；orgNames 是这家公司发消息时开头用的组织名（公司、实验室、团队），
 * 在它自己的主题页上读者知道说的是谁，可以省去；otherNames 是公司的其他称呼（官方账号名、子品牌）。
 * 所有这些名字都用来认出说的是哪家公司，比如把事实的主体对到发布方。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; orgNames?: string[]; otherNames?: string[] }> = {
  hebtig: { name: "河北交投集团", displayTag: "河北交投", aliases: ["河北交投", "河北交通投资集团", "河北省交通投资集团"], orgNames: ["河北交通投资集团有限公司", "河北省交通投资集团有限公司"] },
  ccccltd: { name: "中交集团", displayTag: "中交集团", aliases: ["中交集团", "中国交建", "中国交通建设集团", "CCCC"], orgNames: ["中国交通建设集团有限公司", "中国交通建设股份有限公司"] },
  crec: { name: "中国中铁", displayTag: "中国中铁", aliases: ["中国中铁", "中铁集团"], orgNames: ["中国中铁股份有限公司"] },
  crcc: { name: "中国铁建", displayTag: "中国铁建", aliases: ["中国铁建", "铁建"], orgNames: ["中国铁建股份有限公司"] },
  cmgroup: { name: "招商局集团", displayTag: "招商局集团", aliases: ["招商局", "招商局集团"], orgNames: ["招商局集团有限公司"] },
  mot: { name: "交通运输部", displayTag: "交通运输部", aliases: ["交通运输部", "交通部"], orgNames: ["交通运输部"] },
  bjchewang: { name: "北京车网", displayTag: "北京车网", aliases: ["北京车网", "北京车网科技发展"], orgNames: ["北京车网科技发展有限公司"], otherNames: ["北京车网科技"] },
  xiangjiang: { name: "湘江智能", displayTag: "湘江智能", aliases: ["湘江智能", "湖南湘江智能"], orgNames: ["湖南湘江智能科技创新中心有限公司"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "hebtig", name: "河北交投集团", patterns: [/河北交投|河北.{0,4}交通投资/i] },
  { id: "ccccltd", name: "中交集团", patterns: [/中交集团|中国交建|中国交通建设/i, /\bCCCC\b/] },
  { id: "crec", name: "中国中铁", patterns: [/中国中铁/i] },
  { id: "crcc", name: "中国铁建", patterns: [/中国铁建/i] },
  { id: "cmgroup", name: "招商局集团", patterns: [/招商局/i] },
  { id: "mot", name: "交通运输部", patterns: [/交通运输部|交通部/i] },
  { id: "bjchewang", name: "北京车网", patterns: [/北京车网/i] },
  { id: "xiangjiang", name: "湘江智能", patterns: [/湘江智能/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "hebtig", domains: ["ebidding.hebtig.com"] },
  { entityId: "mot", domains: ["mot.gov.cn", "xxgk.mot.gov.cn"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];