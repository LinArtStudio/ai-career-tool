// ============================================================
// 面试题库 v2.0 - 覆盖所有岗位
// ============================================================

export interface InterviewQuestion {
  id: string;
  company: string;
  position: string;
  category: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  tips: string;
  source: string;
}

// AI工程师题库（新增10题）
export const AI_ENGINEER_QUESTIONS: InterviewQuestion[] = [
  {
    id: "ai-engineer-1",
    company: "通用",
    position: "AI工程师",
    category: "技术面试",
    question: "请解释Transformer架构的核心原理，以及它解决了什么问题？",
    difficulty: "hard",
    tips: "从自注意力机制、位置编码、并行计算三个角度",
    source: "通用"
  },
  {
    id: "ai-engineer-2",
    company: "通用",
    position: "AI工程师",
    category: "技术面试",
    question: "如何优化大模型的推理速度？请给出具体方案。",
    difficulty: "hard",
    tips: "量化、剪枝、知识蒸馏、模型并行、TensorRT优化",
    source: "通用"
  },
  {
    id: "ai-engineer-3",
    company: "通用",
    position: "AI工程师",
    category: "技术面试",
    question: "RAG和Fine-tuning有什么区别？什么场景下用哪个？",
    difficulty: "medium",
    tips: "RAG适合知识库频繁更新，Fine-tuning适合数据稳定场景",
    source: "通用"
  },
  {
    id: "ai-engineer-4",
    company: "通用",
    position: "AI工程师",
    category: "技术面试",
    question: "如何评估一个AI模型的效果？请给出评估指标体系。",
    difficulty: "medium",
    tips: "准确率、召回率、F1-score、AUC、混淆矩阵",
    source: "通用"
  },
  {
    id: "ai-engineer-5",
    company: "通用",
    position: "AI工程师",
    category: "系统设计",
    question: "请设计一个AI推荐系统的架构，包括数据流和模型服务。",
    difficulty: "hard",
    tips: "召回→粗排→精排→重排，特征工程+模型选择",
    source: "通用"
  },
  {
    id: "ai-engineer-6",
    company: "通用",
    position: "AI工程师",
    category: "技术面试",
    question: "如何处理AI模型的幻觉问题？请给出具体方案。",
    difficulty: "hard",
    tips: "RAG、RLHF、事实检测、来源验证、置信度",
    source: "通用"
  },
  {
    id: "ai-engineer-7",
    company: "通用",
    position: "AI工程师",
    category: "技术面试",
    question: "请解释Prompt Engineering的最佳实践，以及如何设计高质量的Prompt。",
    difficulty: "medium",
    tips: "Few-shot、Chain of Thought、Self-Consistency",
    source: "通用"
  },
  {
    id: "ai-engineer-8",
    company: "通用",
    position: "AI工程师",
    category: "系统设计",
    question: "如何设计一个AI Agent的工作流？请给出架构设计。",
    difficulty: "hard",
    tips: "任务分解、工具调用、记忆管理、异常处理",
    source: "通用"
  },
  {
    id: "ai-engineer-9",
    company: "通用",
    position: "AI工程师",
    category: "技术面试",
    question: "如何评估AI模型的公平性？如何处理偏见问题？",
    difficulty: "medium",
    tips: "公平性指标、偏见检测、数据增强、对抗训练",
    source: "通用"
  },
  {
    id: "ai-engineer-10",
    company: "通用",
    position: "AI工程师",
    category: "系统设计",
    question: "请设计一个AI模型的A/B测试方案，如何评估模型效果？",
    difficulty: "medium",
    tips: "分流策略、评估指标、显著性检验、上线标准",
    source: "通用"
  }
];

// AI运营题库（新增10题）
export const AI_OPERATION_QUESTIONS: InterviewQuestion[] = [
  {
    id: "ai-operation-1",
    company: "通用",
    position: "AI运营",
    category: "业务理解",
    question: "如何用AI提升内容运营效率？请给出具体方案。",
    difficulty: "medium",
    tips: "ChatGPT生成文案、Midjourney生成图片、AI视频生成",
    source: "通用"
  },
  {
    id: "ai-operation-2",
    company: "通用",
    position: "AI运营",
    category: "数据思维",
    question: "如何用AI进行用户画像分析？请给出分析框架。",
    difficulty: "medium",
    tips: "聚类分析、RFM模型、用户标签体系",
    source: "通用"
  },
  {
    id: "ai-operation-3",
    company: "通用",
    position: "AI运营",
    category: "业务理解",
    question: "如何用AI优化广告投放效果？请给出优化方案。",
    difficulty: "hard",
    tips: "智能出价、创意优化、受众定向、A/B测试",
    source: "通用"
  },
  {
    id: "ai-operation-4",
    company: "通用",
    position: "AI运营",
    category: "业务理解",
    question: "如何用AI进行社群运营？请给出具体策略。",
    difficulty: "medium",
    tips: "智能客服、内容推荐、用户分层、自动化运营",
    source: "通用"
  },
  {
    id: "ai-operation-5",
    company: "通用",
    position: "AI运营",
    category: "数据思维",
    question: "如何用AI进行数据分析？请给出分析流程。",
    difficulty: "medium",
    tips: "数据清洗、特征工程、模型训练、结果可视化",
    source: "通用"
  },
  {
    id: "ai-operation-6",
    company: "通用",
    position: "AI运营",
    category: "业务理解",
    question: "如何用AI进行竞品分析？请给出分析框架。",
    difficulty: "medium",
    tips: "竞品监控、功能对比、用户评价分析、市场趋势",
    source: "通用"
  },
  {
    id: "ai-operation-7",
    company: "通用",
    position: "AI运营",
    category: "业务理解",
    question: "如何用AI进行用户反馈分析？请给出分析方法。",
    difficulty: "medium",
    tips: "情感分析、关键词提取、问题分类、优先级排序",
    source: "通用"
  },
  {
    id: "ai-operation-8",
    company: "通用",
    position: "AI运营",
    category: "业务理解",
    question: "如何用AI进行活动策划？请给出策划流程。",
    difficulty: "medium",
    tips: "活动创意、目标用户、传播策略、效果评估",
    source: "通用"
  },
  {
    id: "ai-operation-9",
    company: "通用",
    position: "AI运营",
    category: "业务理解",
    question: "如何用AI进行SEO优化？请给出优化方案。",
    difficulty: "medium",
    tips: "关键词研究、内容优化、外链建设、技术SEO",
    source: "通用"
  },
  {
    id: "ai-operation-10",
    company: "通用",
    position: "AI运营",
    category: "业务理解",
    question: "如何用AI进行用户增长？请给出增长策略。",
    difficulty: "hard",
    tips: "用户获取、用户激活、用户留存、用户变现",
    source: "通用"
  }
];

// 传统岗位+AI题库（新增20题）
export const TRADITIONAL_WITH_AI_QUESTIONS: InterviewQuestion[] = [
  {
    id: "traditional-ai-1",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI提升工作效率？请举例说明。",
    difficulty: "medium",
    tips: "结合具体场景，展示AI工具使用能力",
    source: "通用"
  },
  {
    id: "traditional-ai-2",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你用过哪些AI工具？效果如何？",
    difficulty: "easy",
    tips: "列举2-3个AI工具，说明使用场景和效果",
    source: "通用"
  },
  {
    id: "traditional-ai-3",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "AI对你的岗位有什么影响？你如何看待？",
    difficulty: "medium",
    tips: "分析AI的机遇和挑战，展示积极态度",
    source: "通用"
  },
  {
    id: "traditional-ai-4",
    company: "通用",
    position: "传统岗位+AI",
    category: "学习能力",
    question: "你如何学习AI技能？学习路径是什么？",
    difficulty: "easy",
    tips: "展示学习计划和执行力",
    source: "通用"
  },
  {
    id: "traditional-ai-5",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你认为AI会取代你的岗位吗？为什么？",
    difficulty: "medium",
    tips: "分析AI的局限性，强调人类不可替代的能力",
    source: "通用"
  },
  {
    id: "traditional-ai-6",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行数据分析？",
    difficulty: "medium",
    tips: "结合具体场景，展示数据分析能力",
    source: "通用"
  },
  {
    id: "traditional-ai-7",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行内容创作？",
    difficulty: "medium",
    tips: "结合具体场景，展示内容创作能力",
    source: "通用"
  },
  {
    id: "traditional-ai-8",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行用户研究？",
    difficulty: "medium",
    tips: "结合具体场景，展示用户研究能力",
    source: "通用"
  },
  {
    id: "traditional-ai-9",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行竞品分析？",
    difficulty: "medium",
    tips: "结合具体场景，展示竞品分析能力",
    source: "通用"
  },
  {
    id: "traditional-ai-10",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行项目管理？",
    difficulty: "medium",
    tips: "结合具体场景，展示项目管理能力",
    source: "通用"
  },
  {
    id: "traditional-ai-11",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行沟通协作？",
    difficulty: "easy",
    tips: "结合具体场景，展示沟通协作能力",
    source: "通用"
  },
  {
    id: "traditional-ai-12",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行决策支持？",
    difficulty: "medium",
    tips: "结合具体场景，展示决策支持能力",
    source: "通用"
  },
  {
    id: "traditional-ai-13",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行创新设计？",
    difficulty: "medium",
    tips: "结合具体场景，展示创新设计能力",
    source: "通用"
  },
  {
    id: "traditional-ai-14",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行风险控制？",
    difficulty: "medium",
    tips: "结合具体场景，展示风险控制能力",
    source: "通用"
  },
  {
    id: "traditional-ai-15",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行成本优化？",
    difficulty: "medium",
    tips: "结合具体场景，展示成本优化能力",
    source: "通用"
  },
  {
    id: "traditional-ai-16",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行质量提升？",
    difficulty: "medium",
    tips: "结合具体场景，展示质量提升能力",
    source: "通用"
  },
  {
    id: "traditional-ai-17",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行效率提升？",
    difficulty: "easy",
    tips: "结合具体场景，展示效率提升能力",
    source: "通用"
  },
  {
    id: "traditional-ai-18",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行客户管理？",
    difficulty: "medium",
    tips: "结合具体场景，展示客户管理能力",
    source: "通用"
  },
  {
    id: "traditional-ai-19",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行供应链优化？",
    difficulty: "hard",
    tips: "结合具体场景，展示供应链优化能力",
    source: "通用"
  },
  {
    id: "traditional-ai-20",
    company: "通用",
    position: "传统岗位+AI",
    category: "AI能力",
    question: "你如何用AI进行战略规划？",
    difficulty: "hard",
    tips: "结合具体场景，展示战略规划能力",
    source: "通用"
  }
];

// 合并所有题库
export const ALL_QUESTIONS_V2: InterviewQuestion[] = [
  ...AI_ENGINEER_QUESTIONS,
  ...AI_OPERATION_QUESTIONS,
  ...TRADITIONAL_WITH_AI_QUESTIONS
];
