export const POPULAR_JOBS = [
  // 技术类
  "前端开发工程师", "后端开发工程师", "全栈开发工程师", "Java开发工程师", "Python开发工程师",
  "Go开发工程师", "C++开发工程师", "iOS开发工程师", "Android开发工程师", "测试工程师",
  "运维工程师", "DevOps工程师", "数据工程师", "算法工程师", "机器学习工程师",
  "深度学习工程师", "NLP工程师", "CV工程师", "大模型工程师", "AI应用开发工程师",
  // 产品类
  "产品经理", "AI产品经理", "数据产品经理", "商业化产品经理", "策略产品经理",
  "用户产品经理", "B端产品经理", "C端产品经理", "游戏产品经理", "增长产品经理",
  // 设计类
  "UI设计师", "UX设计师", "交互设计师", "视觉设计师", "品牌设计师",
  "AI设计师", "3D设计师", "动效设计师",
  // 运营类
  "用户运营", "内容运营", "数据运营", "活动运营", "社区运营",
  "电商运营", "直播运营", "私域运营",
  // 市场类
  "市场营销", "品牌营销", "数字营销", "增长黑客", "商务拓展",
  // 数据类
  "数据分析师", "数据科学家", "商业分析师", "BI工程师",
  // 其他
  "项目经理", "人力资源", "财务分析", "咨询顾问", "投资分析师",
];

export const POPULAR_COMPANIES = [
  // 互联网大厂
  "字节跳动", "腾讯", "阿里巴巴", "百度", "美团", "京东", "拼多多", "网易",
  "快手", "小红书", "哔哩哔哩", "滴滴", "携程", "58同城", "知乎",
  // AI公司
  "小米", "华为", "OPPO", "vivo", "荣耀", "大疆", "商汤科技", "旷视科技",
  "科大讯飞", "智谱AI", "月之暗面", "MiniMax", "百川智能", "零一万物",
  // 外企
  "微软", "谷歌", "苹果", "亚马逊", "Meta", "英伟达", "特斯拉", "高通",
  // 金融
  "蚂蚁集团", "微众银行", "陆金所", "平安科技", "招银网络",
  // 新兴
  "SHEIN", "TikTok", "Temu", "米哈游", "莉莉丝", "鹰角网络",
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
