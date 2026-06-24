// ============================================================
// 模型路由模块 - 智能选择模型，优化成本
// ============================================================

// 模型配置
export interface ModelConfig {
  name: string;
  provider: string;
  maxTokens: number;
  costPer1kTokens: number;
  speed: "fast" | "medium" | "slow";
  quality: "low" | "medium" | "high";
}

// 可用模型
export const MODELS: Record<string, ModelConfig> = {
  // 小模型 - 简单任务
  "mimo-lite": {
    name: "mimo-lite",
    provider: "xiaomi",
    maxTokens: 2048,
    costPer1kTokens: 0.001,
    speed: "fast",
    quality: "low",
  },
  // 中等模型 - 一般任务
  "mimo-standard": {
    name: "mimo-standard",
    provider: "xiaomi",
    maxTokens: 4096,
    costPer1kTokens: 0.003,
    speed: "medium",
    quality: "medium",
  },
  // 大模型 - 复杂任务
  "mimo-pro": {
    name: "mimo-pro",
    provider: "xiaomi",
    maxTokens: 8192,
    costPer1kTokens: 0.01,
    speed: "slow",
    quality: "high",
  },
};

// 任务类型
export type TaskType =
  | "interview_generate" // 生成面试题
  | "interview_evaluate" // 评估面试回答
  | "resume_analyze" // 简历分析
  | "resume_rewrite" // 简历改写
  | "jd_match" // JD匹配
  | "career_plan" // 职业规划
  | "cover_letter" // 求职信
  | "simple问答"; // 简单问答

// 任务复杂度
export type TaskComplexity = "simple" | "medium" | "complex";

// 任务配置
interface TaskConfig {
  complexity: TaskComplexity;
  recommendedModel: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
}

// 任务模型映射
const TASK_MODEL_MAP: Record<TaskType, TaskConfig> = {
  // 简单任务 - 用小模型
  interview_generate: {
    complexity: "medium",
    recommendedModel: "mimo-standard",
    fallbackModel: "mimo-lite",
    maxTokens: 1500,
    temperature: 0.7,
  },
  // 复杂任务 - 用大模型
  interview_evaluate: {
    complexity: "complex",
    recommendedModel: "mimo-pro",
    fallbackModel: "mimo-standard",
    maxTokens: 2000,
    temperature: 0.3,
  },
  // 简单任务 - 用小模型
  resume_analyze: {
    complexity: "medium",
    recommendedModel: "mimo-standard",
    fallbackModel: "mimo-lite",
    maxTokens: 1500,
    temperature: 0.5,
  },
  // 复杂任务 - 用大模型
  resume_rewrite: {
    complexity: "complex",
    recommendedModel: "mimo-pro",
    fallbackModel: "mimo-standard",
    maxTokens: 3000,
    temperature: 0.5,
  },
  // 中等任务 - 用中等模型
  jd_match: {
    complexity: "medium",
    recommendedModel: "mimo-standard",
    fallbackModel: "mimo-lite",
    maxTokens: 2000,
    temperature: 0.3,
  },
  // 复杂任务 - 用大模型
  career_plan: {
    complexity: "complex",
    recommendedModel: "mimo-pro",
    fallbackModel: "mimo-standard",
    maxTokens: 3000,
    temperature: 0.7,
  },
  // 中等任务 - 用中等模型
  cover_letter: {
    complexity: "medium",
    recommendedModel: "mimo-standard",
    fallbackModel: "mimo-lite",
    maxTokens: 2000,
    temperature: 0.7,
  },
  // 简单任务 - 用小模型
  simple问答: {
    complexity: "simple",
    recommendedModel: "mimo-lite",
    fallbackModel: "mimo-lite",
    maxTokens: 500,
    temperature: 0.5,
  },
};

// 获取推荐模型
export function getRecommendedModel(taskType: TaskType): {
  model: ModelConfig;
  maxTokens: number;
  temperature: number;
} {
  const taskConfig = TASK_MODEL_MAP[taskType];
  const model = MODELS[taskConfig.recommendedModel];

  return {
    model,
    maxTokens: taskConfig.maxTokens,
    temperature: taskConfig.temperature,
  };
}

// 获取回退模型
export function getFallbackModel(taskType: TaskType): {
  model: ModelConfig;
  maxTokens: number;
  temperature: number;
} {
  const taskConfig = TASK_MODEL_MAP[taskType];
  const model = MODELS[taskConfig.fallbackModel];

  return {
    model,
    maxTokens: taskConfig.maxTokens,
    temperature: taskConfig.temperature,
  };
}

// 根据内容复杂度选择模型
export function selectModelByContent(
  content: string,
  taskType: TaskType
): {
  model: ModelConfig;
  maxTokens: number;
  temperature: number;
} {
  const taskConfig = TASK_MODEL_MAP[taskType];

  // 分析内容复杂度
  const contentLength = content.length;
  const hasComplexKeywords = /RAG|Agent|Prompt Engineering|模型评估|Fine-tuning/i.test(
    content
  );
  const hasMultipleQuestions = (content.match(/\?/g) || []).length > 3;

  // 根据内容复杂度调整
  let complexity = taskConfig.complexity;
  if (contentLength > 2000 || hasComplexKeywords || hasMultipleQuestions) {
    complexity = "complex";
  } else if (contentLength < 500) {
    complexity = "simple";
  }

  // 选择模型
  let modelName: string;
  switch (complexity) {
    case "simple":
      modelName = "mimo-lite";
      break;
    case "complex":
      modelName = "mimo-pro";
      break;
    default:
      modelName = taskConfig.recommendedModel;
  }

  const model = MODELS[modelName];
  return {
    model,
    maxTokens: taskConfig.maxTokens,
    temperature: taskConfig.temperature,
  };
}

// 计算成本
export function calculateCost(modelName: string, tokenCount: number): number {
  const model = MODELS[modelName];
  if (!model) return 0;
  return (tokenCount / 1000) * model.costPer1kTokens;
}

// 获取模型统计
export function getModelStats(): {
  totalModels: number;
  models: Array<{
    name: string;
    provider: string;
    speed: string;
    quality: string;
    costPer1kTokens: number;
  }>;
} {
  return {
    totalModels: Object.keys(MODELS).length,
    models: Object.entries(MODELS).map(([name, config]) => ({
      name,
      provider: config.provider,
      speed: config.speed,
      quality: config.quality,
      costPer1kTokens: config.costPer1kTokens,
    })),
  };
}
