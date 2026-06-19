// ============================================================
// 中国就业市场完整数据库
// 数据来源：BOSS直聘、猎聘、智联招聘、教育部专业目录
// 更新：2026年6月
// ============================================================

// ==================== 热门岗位（按行业分类）====================

const TECH_JOBS = [
  // 前端
  "前端开发工程师", "高级前端开发工程师", "前端架构师", "Web前端开发", "H5开发工程师",
  "React开发工程师", "Vue开发工程师", "小程序开发工程师", "大前端开发",
  // 后端
  "后端开发工程师", "高级后端开发工程师", "Java开发工程师", "Java高级开发", "Java架构师",
  "Python开发工程师", "Go开发工程师", "C++开发工程师", "C#开发工程师", "PHP开发工程师",
  "Rust开发工程师", "Node.js开发工程师", ".NET开发工程师", "Ruby开发工程师",
  // 移动端
  "iOS开发工程师", "Android开发工程师", "Flutter开发工程师", "React Native开发",
  "鸿蒙开发工程师", "移动端架构师",
  // 全栈
  "全栈开发工程师", "高级全栈开发工程师", "技术负责人",
  // 测试
  "测试工程师", "测试开发工程师", "自动化测试工程师", "性能测试工程师", "安全测试工程师",
  "测试经理", "质量保证工程师",
  // 运维/DevOps
  "运维工程师", "DevOps工程师", "SRE工程师", "云计算工程师", "容器工程师",
  "系统管理员", "网络工程师", "DBA数据库管理员",
  // 数据
  "数据工程师", "大数据开发工程师", "数据仓库工程师", "ETL工程师", "数据架构师",
  // 安全
  "安全工程师", "渗透测试工程师", "安全架构师", "安全运营工程师",
  // 硬件/嵌入式
  "嵌入式开发工程师", "FPGA工程师", "芯片设计工程师", "硬件工程师", "射频工程师",
];

const AI_JOBS = [
  "算法工程师", "机器学习工程师", "深度学习工程师", "NLP工程师", "CV工程师",
  "大模型工程师", "AI应用开发工程师", "AI产品经理", "AI训练师", "提示词工程师",
  "AIGC工程师", "大模型微调工程师", "AI推理优化工程师", "多模态算法工程师",
  "推荐算法工程师", "搜索算法工程师", "广告算法工程师", "风控算法工程师",
  "语音识别工程师", "自动驾驶算法工程师", "机器人算法工程师", "AI数据标注工程师",
  "机器视觉工程师", "知识图谱工程师", "强化学习工程师",
];

const PRODUCT_JOBS = [
  "产品经理", "高级产品经理", "产品总监", "AI产品经理", "数据产品经理",
  "商业化产品经理", "策略产品经理", "用户产品经理", "B端产品经理", "C端产品经理",
  "游戏产品经理", "增长产品经理", "内容产品经理", "支付产品经理", "供应链产品经理",
  "SaaS产品经理", "平台产品经理", "工具产品经理", "社交产品经理",
  "产品专家", "产品运营经理", "产品规划经理",
];

const DESIGN_JOBS = [
  "UI设计师", "UX设计师", "交互设计师", "视觉设计师", "品牌设计师",
  "平面设计师", "电商设计师", "插画师", "3D设计师", "动效设计师",
  "AI设计师", "游戏美术设计师", "场景设计师", "角色设计师",
  "工业设计师", "室内设计师", "展陈设计师", "服装设计师",
  "设计总监", "创意总监", "艺术指导",
];

const OPERATIONS_JOBS = [
  "用户运营", "内容运营", "数据运营", "活动运营", "社区运营",
  "电商运营", "直播运营", "私域运营", "社群运营", "品牌运营",
  "游戏运营", "商家运营", "渠道运营", "新媒体运营", "短视频运营",
  "抖音运营", "小红书运营", "微信运营", "微博运营",
  "运营总监", "运营经理", "运营专家", "增长运营",
];

const MARKETING_JOBS = [
  "市场营销经理", "品牌经理", "数字营销经理", "增长黑客", "商务拓展(BD)",
  "市场总监", "公关经理", "媒介经理", "SEM优化师", "SEO优化师",
  "信息流优化师", "广告投放经理", "KOL运营", "MCN运营",
  "海外市场经理", "品牌策划", "市场分析师",
];

const DATA_JOBS = [
  "数据分析师", "高级数据分析师", "数据科学家", "商业分析师", "BI工程师",
  "数据产品经理", "数据运营", "用户分析师", "市场分析师", "财务分析师",
  "风控分析师", "策略分析师", "行业研究员",
];

const FINANCE_JOBS = [
  "投资经理", "基金经理", "风控经理", "合规经理", "审计经理",
  "财务经理", "财务总监(CFO)", "会计", "税务经理", "资金经理",
  "投行分析师", "行研分析师", "量化研究员", "精算师",
  "信贷经理", "理财顾问", "保险精算师",
];

const HR_JOBS = [
  "人力资源经理", "招聘经理", "培训经理", "薪酬绩效经理", "HRBP",
  "人力资源总监", "组织发展经理", "人才发展经理", "员工关系经理",
  "猎头顾问", "RPO项目经理",
];

const EDUCATION_JOBS = [
  "课程设计师", "教学设计师", "在线教育运营", "教育产品经理",
  "培训师", "企业内训师", "学科教师", "教研员", "教务管理",
  "留学顾问", "职业规划师", "考研辅导老师", "公考培训师",
];

const OTHER_JOBS = [
  "项目经理", "项目管理专家(PMP)", "敏捷教练", "咨询顾问",
  "管理咨询", "战略咨询", "IT咨询",
  "法务经理", "知识产权经理", "合规官",
  "供应链经理", "采购经理", "物流经理",
  "销售经理", "大客户经理", "区域经理", "渠道经理",
  "客服经理", "客户成功经理", "技术支持工程师",
  "记者", "编辑", "编剧", "导演", "制片人",
  "建筑师", "结构工程师", "暖通工程师", "电气工程师",
  "医生", "护士", "药剂师", "医疗器械工程师",
];

export const POPULAR_JOBS = [
  ...AI_JOBS, ...TECH_JOBS, ...PRODUCT_JOBS, ...DESIGN_JOBS,
  ...OPERATIONS_JOBS, ...MARKETING_JOBS, ...DATA_JOBS,
  ...FINANCE_JOBS, ...HR_JOBS, ...EDUCATION_JOBS, ...OTHER_JOBS,
];

// ==================== 热门公司（按行业分类）====================

const INTERNET_COMPANIES = [
  "字节跳动", "腾讯", "阿里巴巴", "百度", "美团", "京东", "拼多多", "网易",
  "快手", "小红书", "哔哩哔哩", "滴滴出行", "携程集团", "58同城", "知乎",
  "贝壳找房", "得物", "唯品会", "当当网", "苏宁易购", "国美零售",
  "搜狐", "新浪", "微博", "凤凰网", "36氪", "虎嗅",
  "爱奇艺", "优酷", "芒果超媒", "腾讯视频", "抖音", "西瓜视频",
];

const AI_COMPANIES = [
  "小米", "华为", "OPPO", "vivo", "荣耀", "中兴通讯", "联想",
  "大疆创新", "商汤科技", "旷视科技", "云从科技", "依图科技",
  "科大讯飞", "思必驰", "云知声", "出门问问",
  "智谱AI", "月之暗面(Kimi)", "MiniMax", "百川智能", "零一万物",
  "深度求索(DeepSeek)", "阶跃星辰", "面壁智能", "昆仑万维",
  "第四范式", "旷视科技", "地平线机器人", "寒武纪", "海光信息",
];

const TECH_GIANTS = [
  "微软中国", "谷歌中国", "苹果中国", "亚马逊(AWS)", "英伟达",
  "Meta中国", "高通中国", "英特尔中国", "AMD中国", "特斯拉中国",
  "SAP中国", "Oracle中国", "Salesforce中国", "Adobe中国",
];

const FINANCE_COMPANIES = [
  "蚂蚁集团", "微众银行", "网商银行", "陆金所", "京东科技",
  "平安科技", "招银网络", "中金公司", "中信证券", "华泰证券",
  "国泰君安", "海通证券", "招商银行", "工商银行", "建设银行",
  "中国银行", "农业银行", "交通银行", "兴业银行", "浦发银行",
  "中国平安", "中国人寿", "太平洋保险", "泰康保险",
];

const MANUFACTURE_COMPANIES = [
  "比亚迪", "宁德时代", "隆基绿能", "中芯国际", "京东方",
  "海尔智家", "美的集团", "格力电器", "TCL科技", "海信视像",
  "中国中车", "三一重工", "中联重科", "徐工机械",
  "上汽集团", "广汽集团", "蔚来汽车", "小鹏汽车", "理想汽车",
  "吉利汽车", "长城汽车", "零跑汽车", "哪吒汽车",
];

const CONSUMER_COMPANIES = [
  "SHEIN", "Temu", "AliExpress", "安克创新", "PatPat",
  "元气森林", "瑞幸咖啡", "喜茶", "奈雪的茶", "蜜雪冰城",
  "完美日记", "花西子", "泡泡玛特", "名创优品",
  "伊利集团", "蒙牛乳业", "农夫山泉", "贵州茅台",
];

const GAME_COMPANIES = [
  "米哈游", "莉莉丝", "鹰角网络", "叠纸网络", "完美世界",
  "三七互娱", "游族网络", "世纪华通", "吉比特", "中手游",
  "沐瞳科技", "IGG", "趣加(FunPlus)", "智明星通",
];

export const POPULAR_COMPANIES = [
  ...AI_COMPANIES, ...INTERNET_COMPANIES, ...TECH_GIANTS,
  ...FINANCE_COMPANIES, ...MANUFACTURE_COMPANIES,
  ...CONSUMER_COMPANIES, ...GAME_COMPANIES,
];

// ==================== 大学专业（教育部本科专业目录）====================

const CS_MAJORS = [
  "计算机科学与技术", "软件工程", "人工智能", "数据科学与大数据技术",
  "信息安全", "网络工程", "物联网工程", "智能科学与技术",
  "数字媒体技术", "空间信息与数字技术", "电子与计算机工程",
  "区块链工程", "网络空间安全", "新媒体技术", "电影制作",
  "虚拟现实技术", "区块链工程", "密码科学与技术",
];

const EE_MAJORS = [
  "电子信息工程", "通信工程", "微电子科学与工程", "光电信息科学与工程",
  "信息工程", "集成电路设计与集成系统", "电磁场与无线技术",
  "电子信息科学与技术", "电信工程及管理", "人工智能",
  "自动化", "电气工程及其自动化", "电气工程与智能控制",
  "机器人工程", "智能制造工程", "智能感知工程",
];

const ME_MAJORS = [
  "机械工程", "机械设计制造及其自动化", "材料成型及控制工程",
  "车辆工程", "测控技术与仪器", "工业设计",
  "过程装备与控制工程", "机械电子工程", "智能制造工程",
];

const BUSINESS_MAJORS = [
  "工商管理", "市场营销", "会计学", "财务管理", "人力资源管理",
  "国际商务", "物流管理", "电子商务", "信息管理与信息系统",
  "旅游管理", "酒店管理", "会展经济与管理", "房地产开发与管理",
  "大数据管理与应用", "工程管理", "工程造价",
];

const ECONOMICS_MAJORS = [
  "经济学", "金融学", "国际经济与贸易", "财政学", "保险学",
  "金融工程", "经济统计学", "国民经济管理", "税收学",
  "投资学", "金融科技", "数字经济",
];

const LAW_MAJORS = [
  "法学", "知识产权", "监狱学", "信用风险管理与法律防控",
];

const LITERATURE_MAJORS = [
  "汉语言文学", "汉语国际教育", "英语", "日语", "法语", "德语",
  "西班牙语", "俄语", "阿拉伯语", "朝鲜语", "翻译",
  "新闻学", "广播电视学", "广告学", "传播学", "编辑出版学",
  "网络与新媒体", "数字出版",
];

const ART_MAJORS = [
  "视觉传达设计", "环境设计", "产品设计", "服装与服饰设计",
  "数字媒体艺术", "艺术设计学", "动画", "美术学", "绘画",
  "雕塑", "摄影", "中国画", "书法学", "工艺美术",
  "艺术与科技", "新媒体艺术", "包装设计",
];

const SCIENCE_MAJORS = [
  "数学与应用数学", "信息与计算科学", "物理学", "应用物理学",
  "化学", "应用化学", "生物科学", "生物技术", "生态学",
  "统计学", "应用统计学", "数据科学",
];

const MEDICAL_MAJORS = [
  "临床医学", "口腔医学", "中医学", "针灸推拿学", "药学",
  "药物制剂", "中药学", "护理学", "医学检验技术", "医学影像技术",
  "康复治疗学", "公共卫生与预防医学", "卫生检验与检疫",
];

const ARCHITECTURE_MAJORS = [
  "建筑学", "城乡规划", "风景园林", "土木工程", "建筑环境与能源应用工程",
  "给排水科学与工程", "建筑电气与智能化", "工程管理",
];

const OTHER_MAJORS = [
  "心理学", "应用心理学", "教育学", "学前教育", "小学教育",
  "体育教育", "社会体育指导与管理", "运动训练",
  "哲学", "逻辑学", "宗教学", "伦理学",
  "历史学", "考古学", "文物与博物馆学",
  "地理科学", "自然地理与资源环境", "人文地理与城乡规划",
  "环境科学与工程", "环境工程", "食品科学与工程",
  "农学", "园艺", "植物保护", "动物科学", "动物医学",
  "社会工作", "社会学", "政治学与行政学", "国际政治",
  "行政管理", "公共事业管理", "劳动与社会保障", "土地资源管理",
];

export const POPULAR_MAJORS = [
  ...CS_MAJORS, ...EE_MAJORS, ...ME_MAJORS,
  ...BUSINESS_MAJORS, ...ECONOMICS_MAJORS, ...LAW_MAJORS,
  ...LITERATURE_MAJORS, ...ART_MAJORS, ...SCIENCE_MAJORS,
  ...MEDICAL_MAJORS, ...ARCHITECTURE_MAJORS, ...OTHER_MAJORS,
];

// ==================== 兴趣领域 ====================
export const POPULAR_INTERESTS = [
  // 技术
  "人工智能", "大模型", "机器学习", "深度学习", "自然语言处理", "计算机视觉",
  "前端开发", "后端开发", "移动端开发", "全栈开发", "云计算", "区块链",
  "网络安全", "物联网", "嵌入式", "芯片设计", "量子计算",
  // 数据
  "数据分析", "数据科学", "大数据", "数据可视化", "商业智能(BI)",
  // 产品设计
  "产品设计", "用户体验设计", "UI设计", "交互设计", "服务设计",
  "工业设计", "品牌设计", "平面设计", "3D设计", "动效设计",
  // 商业
  "创业", "投资", "金融", "市场营销", "品牌管理", "电商",
  "供应链管理", "项目管理", "战略咨询",
  // 内容
  "内容创作", "短视频", "直播", "新媒体", "写作", "翻译",
  "摄影", "视频制作", "播客", "动画制作",
  // 行业
  "游戏开发", "游戏设计", "电竞", "教育科技", "医疗健康",
  "新能源", "智能制造", "自动驾驶", "机器人", "航空航天",
  "生物科技", "农业科技", "环保科技",
  // 其他
  "心理学", "社会学", "人类学", "哲学", "艺术", "音乐",
  "体育", "旅游", "美食", "时尚",
];

// ==================== 技能 ====================
export const POPULAR_SKILLS = [
  // 编程语言
  "Python", "Java", "JavaScript", "TypeScript", "Go", "C++", "C", "C#",
  "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", "MATLAB",
  "SQL", "Shell", "Lua", "Dart", "Objective-C",
  // 前端框架
  "React", "Vue", "Angular", "Next.js", "Nuxt.js", "Svelte",
  "jQuery", "Bootstrap", "Tailwind CSS", "Ant Design", "Element UI",
  "微信小程序", "uni-app", "Taro", "Flutter", "React Native",
  // 后端框架
  "Node.js", "Spring Boot", "Django", "Flask", "FastAPI",
  "Express", "Koa", "NestJS", "Gin", "Laravel", "Rails",
  ".NET", "MyBatis", "Hibernate",
  // 数据库
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch",
  "Oracle", "SQL Server", "SQLite", "Cassandra", "HBase",
  "ClickHouse", "TiDB", "Neo4j",
  // 大数据
  "Hadoop", "Spark", "Flink", "Hive", "Kafka", "Airflow",
  "Storm", "Presto", "Druid", "Doris",
  // 云与DevOps
  "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
  "AWS", "阿里云", "腾讯云", "华为云", "Azure", "GCP",
  "Linux", "Nginx", "Terraform", "Ansible", "Prometheus", "Grafana",
  // AI/ML
  "PyTorch", "TensorFlow", "Keras", "scikit-learn", "Pandas", "NumPy",
  "OpenCV", "Hugging Face", "LangChain", "LlamaIndex",
  "大模型微调", "RAG", "Prompt Engineering", "LoRA", "RLHF",
  "Stable Diffusion", "Midjourney", "ComfyUI",
  // 设计工具
  "Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator",
  "After Effects", "Premiere Pro", "Blender", "C4D", "Maya",
  "Canva", "MasterGo", "即时设计",
  // 办公/分析
  "Excel", "PPT", "Word", "Tableau", "Power BI", "SPSS",
  "Google Analytics", "GrowingIO", "神策分析",
  // 软技能
  "项目管理", "团队管理", "演讲表达", "写作能力", "英语",
  "日语", "韩语", "法语", "德语", "西班牙语",
  "数据分析思维", "用户研究", "商业分析", "战略思维",
  "沟通协调", "时间管理", "领导力", "创新思维",
];

// ==================== 搜索函数 ====================
export function searchJobs(query: string): string[] {
  if (!query) return POPULAR_JOBS.slice(0, 12);
  const q = query.toLowerCase();
  return POPULAR_JOBS.filter(j => j.toLowerCase().includes(q)).slice(0, 10);
}

export function searchCompanies(query: string): string[] {
  if (!query) return POPULAR_COMPANIES.slice(0, 12);
  const q = query.toLowerCase();
  return POPULAR_COMPANIES.filter(c => c.toLowerCase().includes(q)).slice(0, 10);
}

export function searchMajors(query: string): string[] {
  if (!query) return POPULAR_MAJORS.slice(0, 12);
  const q = query.toLowerCase();
  return POPULAR_MAJORS.filter(m => m.toLowerCase().includes(q)).slice(0, 10);
}

export function searchInterests(query: string): string[] {
  if (!query) return POPULAR_INTERESTS.slice(0, 12);
  const q = query.toLowerCase();
  return POPULAR_INTERESTS.filter(i => i.toLowerCase().includes(q)).slice(0, 10);
}

export function searchSkills(query: string): string[] {
  if (!query) return POPULAR_SKILLS.slice(0, 12);
  const q = query.toLowerCase();
  return POPULAR_SKILLS.filter(s => s.toLowerCase().includes(q)).slice(0, 10);
}
