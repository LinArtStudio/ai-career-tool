// 热门岗位
export const POPULAR_JOBS = [
  "前端开发工程师", "后端开发工程师", "全栈开发工程师", "Java开发工程师", "Python开发工程师",
  "Go开发工程师", "C++开发工程师", "iOS开发工程师", "Android开发工程师", "测试工程师",
  "运维工程师", "DevOps工程师", "数据工程师", "算法工程师", "机器学习工程师",
  "深度学习工程师", "NLP工程师", "CV工程师", "大模型工程师", "AI应用开发工程师",
  "产品经理", "AI产品经理", "数据产品经理", "商业化产品经理", "策略产品经理",
  "UI设计师", "UX设计师", "交互设计师", "视觉设计师", "品牌设计师",
  "用户运营", "内容运营", "数据运营", "活动运营", "社区运营",
  "数据分析师", "数据科学家", "商业分析师", "BI工程师",
  "项目经理", "人力资源", "财务分析", "咨询顾问", "投资分析师",
];

// 热门公司
export const POPULAR_COMPANIES = [
  "字节跳动", "腾讯", "阿里巴巴", "百度", "美团", "京东", "拼多多", "网易",
  "快手", "小红书", "哔哩哔哩", "滴滴", "携程", "知乎",
  "小米", "华为", "OPPO", "vivo", "荣耀", "大疆", "商汤科技",
  "科大讯飞", "智谱AI", "月之暗面", "MiniMax", "百川智能",
  "微软", "谷歌", "苹果", "亚马逊", "英伟达", "特斯拉",
  "蚂蚁集团", "微众银行", "平安科技",
  "SHEIN", "TikTok", "米哈游", "莉莉丝",
];

// 热门专业
export const POPULAR_MAJORS = [
  "计算机科学与技术", "软件工程", "人工智能", "数据科学与大数据", "信息安全",
  "电子信息工程", "通信工程", "自动化", "电气工程", "物联网工程",
  "数字媒体技术", "智能科学与技术", "网络工程", "信息与计算科学",
  "金融学", "经济学", "会计学", "工商管理", "市场营销", "国际贸易",
  "法学", "新闻传播学", "广告学", "心理学", "教育学",
  "机械工程", "材料科学", "生物工程", "医学", "药学",
  "英语", "日语", "设计学", "建筑学", "城乡规划",
];

// 热门兴趣领域
export const POPULAR_INTERESTS = [
  "人工智能", "大模型", "机器学习", "深度学习", "自然语言处理",
  "前端开发", "后端开发", "移动端开发", "全栈开发", "云计算",
  "数据分析", "数据可视化", "商业分析", "用户研究", "产品设计",
  "UI/UX设计", "3D设计", "动效设计", "品牌设计",
  "内容创作", "短视频", "直播", "新媒体运营", "社群运营",
  "创业", "投资", "金融", "区块链", "Web3",
  "游戏开发", "游戏设计", "电竞",
  "教育", "医疗健康", "新能源", "智能制造",
];

// 热门技能
export const POPULAR_SKILLS = [
  "Python", "Java", "JavaScript", "TypeScript", "Go", "C++", "Rust",
  "React", "Vue", "Node.js", "Spring Boot", "Django", "Flask",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis",
  "Docker", "Kubernetes", "Linux", "Git", "AWS", "阿里云",
  "机器学习", "深度学习", "PyTorch", "TensorFlow", "大模型",
  "数据分析", "Excel", "Tableau", "Power BI", "SPSS",
  "Photoshop", "Figma", "Sketch", "Illustrator", "After Effects",
  "写作", "演讲", "英语", "项目管理", "团队管理",
];

export function searchJobs(query: string): string[] {
  if (!query) return POPULAR_JOBS.slice(0, 10);
  const q = query.toLowerCase();
  return POPULAR_JOBS.filter(j => j.toLowerCase().includes(q)).slice(0, 8);
}

export function searchCompanies(query: string): string[] {
  if (!query) return POPULAR_COMPANIES.slice(0, 10);
  const q = query.toLowerCase();
  return POPULAR_COMPANIES.filter(c => c.toLowerCase().includes(q)).slice(0, 8);
}

export function searchMajors(query: string): string[] {
  if (!query) return POPULAR_MAJORS.slice(0, 10);
  const q = query.toLowerCase();
  return POPULAR_MAJORS.filter(m => m.toLowerCase().includes(q)).slice(0, 8);
}

export function searchInterests(query: string): string[] {
  if (!query) return POPULAR_INTERESTS.slice(0, 10);
  const q = query.toLowerCase();
  return POPULAR_INTERESTS.filter(i => i.toLowerCase().includes(q)).slice(0, 8);
}

export function searchSkills(query: string): string[] {
  if (!query) return POPULAR_SKILLS.slice(0, 10);
  const q = query.toLowerCase();
  return POPULAR_SKILLS.filter(s => s.toLowerCase().includes(q)).slice(0, 8);
}
