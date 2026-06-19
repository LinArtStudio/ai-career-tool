// ============================================================
// 中国大厂面试真题库
// 数据来源：牛客网、脉脉、知乎面经、用户反馈
// ============================================================

export interface InterviewQuestion {
  company: string;
  position: string;
  category: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  tips: string;
  source: string;
}

export const INTERVIEW_DATABASE: InterviewQuestion[] = [
  // ==================== 字节跳动 ====================
  // 产品经理
  { company: "字节跳动", position: "产品经理", category: "行为面试",
    question: "请描述一个你主导的产品从0到1的完整过程，包括如何发现需求、定义MVP、推动上线和验证效果。",
    difficulty: "hard", tips: "用STAR法则，重点突出数据驱动决策", source: "牛客面经" },
  { company: "字节跳动", position: "产品经理", category: "业务理解",
    question: "抖音和快手的用户增长策略有什么不同？如果你是抖音的产品经理，你会如何应对快手的竞争？",
    difficulty: "hard", tips: "从用户画像、内容生态、算法推荐三个维度分析", source: "知乎面经" },
  { company: "字节跳动", position: "产品经理", category: "数据思维",
    question: "抖音的日活DAU突然下降5%，你会如何分析原因？请给出完整的分析框架。",
    difficulty: "hard", tips: "内外因分析→数据拆解→假设验证→行动方案", source: "脉脉面经" },
  { company: "字节跳动", position: "产品经理", category: "情景模拟",
    question: "如果老板要求你在一个月内把某个功能的转化率提升50%，你会怎么做？",
    difficulty: "medium", tips: "先评估可行性，再给出分阶段方案", source: "牛客面经" },
  // 技术
  { company: "字节跳动", position: "前端开发", category: "技术面试",
    question: "请解释React的Fiber架构，以及它解决了什么问题？",
    difficulty: "medium", tips: "从时间切片、优先级调度、并发模式三个角度", source: "牛客面经" },
  { company: "字节跳动", position: "前端开发", category: "技术面试",
    question: "如何优化一个首屏加载时间超过5秒的React应用？请给出完整的优化方案。",
    difficulty: "hard", tips: "代码分割、懒加载、SSR、CDN、缓存策略", source: "知乎面经" },
  { company: "字节跳动", position: "后端开发", category: "技术面试",
    question: "设计一个支持百万级并发的消息推送系统，如何保证消息的可靠性和实时性？",
    difficulty: "hard", tips: "WebSocket长连接、消息队列、分布式架构", source: "牛客面经" },

  // ==================== 腾讯 ====================
  { company: "腾讯", position: "产品经理", category: "产品思维",
    question: "微信为什么不做「已读」功能？从产品角度分析利弊。",
    difficulty: "medium", tips: "从用户体验、社交压力、产品价值观三个维度", source: "知乎面经" },
  { company: "腾讯", position: "产品经理", category: "竞品分析",
    question: "对比微信和支付宝的小程序生态，各自的优势和劣势是什么？",
    difficulty: "medium", tips: "从流量入口、开发者生态、商业变现角度", source: "牛客面经" },
  { company: "腾讯", position: "产品经理", category: "用户增长",
    question: "如何让一个日活100万的社交产品在半年内达到500万？",
    difficulty: "hard", tips: "用户分层→增长漏斗→渠道策略→留存优化", source: "脉脉面经" },
  { company: "腾讯", position: "前端开发", category: "技术面试",
    question: "实现一个虚拟列表组件，支持百万级数据的流畅滚动。请写出核心代码和优化思路。",
    difficulty: "hard", tips: "可视区域渲染+动态高度+请求AnimationFrame", source: "牛客面经" },
  { company: "腾讯", position: "后端开发", category: "系统设计",
    question: "设计一个支持亿级用户的即时通讯系统，如何保证消息不丢失、不重复？",
    difficulty: "hard", tips: "消息ID去重+ACK机制+离线消息存储+分布式架构", source: "牛客面经" },

  // ==================== 阿里巴巴 ====================
  { company: "阿里巴巴", position: "产品经理", category: "商业思维",
    question: "如果你是淘宝的产品经理，如何应对拼多多的低价竞争？",
    difficulty: "hard", tips: "差异化定位、用户分层、供应链优势、品质保障", source: "知乎面经" },
  { company: "阿里巴巴", position: "产品经理", category: "业务理解",
    question: "分析阿里巴巴的电商生态，淘宝、天猫、1688各自的战略定位和协同关系。",
    difficulty: "medium", tips: "从B2C/C2C/B2B定位、用户群体、商业模型角度", source: "牛客面经" },
  { company: "阿里巴巴", position: "技术", category: "技术面试",
    question: "解释分布式系统中的CAP定理，并结合实际案例说明如何在一致性、可用性和分区容错性之间做取舍。",
    difficulty: "hard", tips: "结合阿里中间件（如RocketMQ、OceanBase）的实际案例", source: "牛客面经" },

  // ==================== 美团 ====================
  { company: "美团", position: "产品经理", category: "业务理解",
    question: "美团外卖的配送时间预估模型需要考虑哪些因素？如何优化预估准确率？",
    difficulty: "hard", tips: "距离、天气、商家出餐速度、骑手负载、路况", source: "牛客面经" },
  { company: "美团", position: "产品经理", category: "数据思维",
    question: "美团酒店业务的客单价连续3个月下降，你会如何分析和解决？",
    difficulty: "medium", tips: "拆解维度：城市/星级/渠道/用户群→找到下降主因", source: "脉脉面经" },

  // ==================== 小米 ====================
  { company: "小米", position: "AI产品经理", category: "业务理解",
    question: "小爱同学如何与小米的IoT生态深度结合？请设计一个创新的AI+智能家居场景。",
    difficulty: "hard", tips: "从用户场景、技术可行性、商业价值三个维度", source: "牛客面经" },
  { company: "小米", position: "AI产品经理", category: "产品设计",
    question: "如果要为小米手机设计一个AI拍照功能，你会如何定义需求和衡量效果？",
    difficulty: "medium", tips: "用户需求→功能定义→技术方案→效果指标", source: "知乎面经" },

  // ==================== 百度 ====================
  { company: "百度", position: "产品经理", category: "业务理解",
    question: "百度搜索和抖音搜索的用户行为有什么本质区别？这如何影响产品设计？",
    difficulty: "medium", tips: "主动搜索vs被动推荐、信息获取vs内容消费", source: "牛客面经" },
  { company: "百度", position: "AI工程师", category: "技术面试",
    question: "解释RAG（检索增强生成）的原理，以及如何优化RAG系统的检索准确率？",
    difficulty: "hard", tips: "向量检索+重排序+查询改写+知识图谱", source: "牛客面经" },

  // ==================== 通用面试题 ====================
  { company: "通用", position: "所有岗位", category: "自我介绍",
    question: "请用1-3分钟介绍你自己，重点突出与这个岗位最匹配的经历。",
    difficulty: "easy", tips: "过去→现在→未来结构，控制在2分钟内", source: "通用" },
  { company: "通用", position: "所有岗位", category: "行为面试",
    question: "请举一个你在团队中遇到分歧并成功解决的例子。",
    difficulty: "medium", tips: "用STAR法则，突出沟通能力和结果", source: "通用" },
  { company: "通用", position: "所有岗位", category: "行为面试",
    question: "描述一次你在巨大压力下完成任务的经历。你是如何管理时间和情绪的？",
    difficulty: "medium", tips: "具体场景+压力来源+应对策略+最终结果", source: "通用" },
  { company: "通用", position: "所有岗位", category: "压力面试",
    question: "你最大的缺点是什么？这个缺点如何影响了你的工作？",
    difficulty: "medium", tips: "说真实缺点+改进措施+已取得的进步", source: "通用" },
  { company: "通用", position: "所有岗位", category: "开放性问题",
    question: "如果你入职后发现实际工作与预期不符，你会怎么办？",
    difficulty: "easy", tips: "表达积极态度+主动沟通+适应能力", source: "通用" },
  { company: "通用", position: "所有岗位", category: "职业规划",
    question: "你的3-5年职业规划是什么？为什么选择我们公司？",
    difficulty: "easy", tips: "结合公司发展+个人成长+具体目标", source: "通用" },
];

export function searchQuestions(company?: string, position?: string, category?: string): InterviewQuestion[] {
  return INTERVIEW_DATABASE.filter(q => {
    if (company && q.company !== company && q.company !== "通用") return false;
    if (position && !q.position.includes(position) && q.position !== "所有岗位") return false;
    if (category && q.category !== category) return false;
    return true;
  });
}

export function getCompanies(): string[] {
  return [...new Set(INTERVIEW_DATABASE.map(q => q.company))];
}

export function getPositions(company?: string): string[] {
  return [...new Set(INTERVIEW_DATABASE.filter(q => !company || q.company === company).map(q => q.position))];
}

export function getCategories(): string[] {
  return [...new Set(INTERVIEW_DATABASE.map(q => q.category))];
}
