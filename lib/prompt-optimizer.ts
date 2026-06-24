// ============================================================
// Prompt优化模块 - Few-shot示例 + 思维链（CoT）
// ============================================================

// Prompt模板接口
export interface PromptTemplate {
  system: string;
  user: string;
  examples?: Array<{
    input: string;
    output: string;
  }>;
}

// Few-shot示例库
export const FEW_SHOT_EXAMPLES = {
  // 面试问题生成示例
  interview_generate: [
    {
      input: "岗位：AI产品经理，公司：字节跳动",
      output: `{
  "questions": [
    {
      "id": "q1",
      "question": "请解释RAG的工作原理，什么场景下比fine-tuning更合适？",
      "category": "技术深度",
      "difficulty": "hard",
      "tips": "从技术原理、产品应用场景、选型逻辑三个维度回答"
    },
    {
      "id": "q2",
      "question": "如何设计一个AI客服产品的评估指标体系？",
      "category": "产品设计",
      "difficulty": "hard",
      "tips": "从用户体验、技术指标、商业价值三个维度设计"
    }
  ]
}`,
    },
  ],
  // 面试评估示例
  interview_evaluate: [
    {
      input: `问题：请解释RAG的工作原理
回答：RAG是检索增强生成，先检索相关文档，再用LLM生成答案。`,
      output: `{
  "score": 65,
  "strengths": ["理解了RAG的基本概念", "提到了检索和生成两个步骤"],
  "weaknesses": ["没有详细说明技术细节", "缺少产品应用场景", "没有与Fine-tuning对比"],
  "improved_answer": "RAG（检索增强生成）的工作原理分为三个步骤：1）用户提问时，系统将问题转换为向量；2）在向量数据库中检索最相关的文档片段；3）将检索结果与原始问题一起输入LLM生成答案。相比Fine-tuning，RAG更适合知识库频繁更新、需要引用来源的场景，如企业知识库问答。",
  "key_points": ["向量检索", "文档片段", "LLM生成", "与Fine-tuning对比"],
  "interviewer_notes": "候选人理解基本概念，但缺乏深度，需要追问技术细节"
}`,
    },
  ],
  // 简历分析示例
  resume_analyze: [
    {
      input: "简历内容：3年产品经理经验，负责过电商产品...",
      output: `{
  "score": 75,
  "summary": "简历整体较好，但缺乏AI产品相关经验",
  "dimensions": {
    "structure": {"score": 80, "comment": "结构清晰，模块完整"},
    "content": {"score": 70, "comment": "内容具体，但缺乏量化成果"},
    "keywords": {"score": 65, "comment": "缺少AI相关关键词"},
    "impact": {"score": 75, "comment": "有部分量化成果"},
    "format": {"score": 85, "comment": "格式规范"}
  },
  "top_issues": [
    {"severity": "high", "issue": "缺乏AI产品相关经验", "fix": "添加AI项目经历或学习AI相关技能"},
    {"severity": "medium", "issue": "成果量化不足", "fix": "用具体数据量化工作成果"}
  ]
}`,
    },
  ],
};

// 思维链模板
export const CHAIN_OF_THOUGHT = {
  // 面试评估思维链
  interview_evaluate: `请按照以下步骤评估候选人的回答：

**第1步：理解问题**
- 分析问题的核心要求
- 识别问题考察的能力维度

**第2步：分析回答**
- 识别回答中的关键点
- 评估回答的完整性和准确性
- 检查是否覆盖了所有要点

**第3步：评估优缺点**
- 列出回答的优点（至少2个）
- 列出回答的不足（至少2个）
- 评估回答的深度和广度

**第4步：生成优化建议**
- 提供一个更好的参考回答
- 指出应该补充的关键点
- 给出面试官视角的反馈

**第5步：评分**
- 根据评分标准给出0-100分
- 说明评分理由

请按照这个思维链逐步分析，最后输出JSON格式的结果。`,

  // 简历分析思维链
  resume_analyze: `请按照以下步骤分析简历：

**第1步：整体评估**
- 浏览简历的整体结构
- 识别简历的类型和目标岗位

**第2步：结构分析**
- 检查模块是否完整（个人信息、教育背景、工作经历、技能）
- 评估模块顺序是否合理
- 检查格式是否规范

**第3步：内容分析**
- 分析工作经历的具体性
- 检查是否有量化成果
- 评估与目标岗位的匹配度

**第4步：关键词分析**
- 提取简历中的关键词
- 与目标岗位JD对比
- 识别缺失的关键词

**第5步：综合评分**
- 根据5个维度评分（结构、内容、关键词、成果量化、格式）
- 给出总体评分和排名
- 提供优化建议

请按照这个思维链逐步分析，最后输出JSON格式的结果。`,

  // JD匹配思维链
  jd_match: `请按照以下步骤分析简历和JD的匹配度：

**第1步：JD分析**
- 提取JD的核心要求
- 识别关键技能和经验要求
- 分析岗位的核心职责

**第2步：简历分析**
- 提取简历中的关键信息
- 识别与JD匹配的内容
- 找出缺失的部分

**第3步：匹配度评估**
- 计算各维度的匹配度
- 识别已匹配的关键词
- 识别缺失的关键词

**第4步：差距分析**
- 分析关键差距
- 评估差距的可弥补性
- 提供弥补策略

**第5步：面试问题预测**
- 基于JD预测面试问题
- 基于差距预测压力面试问题
- 提供回答思路

请按照这个思维链逐步分析，最后输出JSON格式的结果。`,
};

// 优化后的Prompt模板
export const OPTIMIZED_PROMPTS = {
  // 面试问题生成（带Few-shot）
  interview_generate: {
    system: `你是一位资深面试官，拥有15年招聘经验。

请根据岗位和公司生成面试问题。

**输出要求**：
- 生成5道面试问题
- 问题要具体有针对性
- 行为面试题引导STAR回答
- 技术题贴合岗位实际
- 难度从易到难

**参考示例**：
${FEW_SHOT_EXAMPLES.interview_generate[0].input}
${FEW_SHOT_EXAMPLES.interview_generate[0].output}`,
    user: "岗位：{jobTitle}，公司：{company}",
  },

  // 面试评估（带思维链）
  interview_evaluate: {
    system: `你是一位资深面试官和职业教练。

${CHAIN_OF_THOUGHT.interview_evaluate}

**评分标准**：
- 内容相关性(30分)
- 结构清晰度(20分)
- 具体性(25分)
- 岗位匹配度(15分)
- 表达流畅度(10分)

**参考示例**：
${FEW_SHOT_EXAMPLES.interview_evaluate[0].input}
${FEW_SHOT_EXAMPLES.interview_evaluate[0].output}`,
    user: "岗位：{jobTitle}\n问题：{question}\n回答：{answer}",
  },

  // 简历分析（带思维链）
  resume_analyze: {
    system: `你是一位资深HR专家和职业顾问。

${CHAIN_OF_THOUGHT.resume_analyze}

**评分标准**：
- 结构(20分)：是否有清晰模块划分
- 内容(25分)：经历描述是否具体有深度
- 关键词(20分)：是否包含行业关键词
- 成果量化(25分)：是否用数据量化成果
- 格式(10分)：排版是否整洁专业

**参考示例**：
${FEW_SHOT_EXAMPLES.resume_analyze[0].input}
${FEW_SHOT_EXAMPLES.resume_analyze[0].output}`,
    user: "请分析以下简历：\n{resume}",
  },

  // JD匹配（带思维链）
  jd_match: {
    system: `你是一位资深HR专家和职业顾问。

${CHAIN_OF_THOUGHT.jd_match}

**评分标准**：
- 技能匹配度(30分)
- 经验匹配度(30分)
- 教育匹配度(15分)
- 软技能匹配度(15分)
- 关键词匹配度(10分)`,
    user: "请分析以下简历和JD的匹配度：\n\n【简历】\n{resume}\n\n【岗位描述(JD)】\n{jd}",
  },
};

// 填充Prompt模板
export function fillPromptTemplate(
  template: PromptTemplate,
  variables: Record<string, string>
): { system: string; user: string } {
  let system = template.system;
  let user = template.user;

  // 替换变量
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    system = system.replace(placeholder, value);
    user = user.replace(placeholder, value);
  });

  return { system, user };
}

// 获取优化后的Prompt
export function getOptimizedPrompt(
  promptType: keyof typeof OPTIMIZED_PROMPTS,
  variables: Record<string, string>
): { system: string; user: string } {
  const template = OPTIMIZED_PROMPTS[promptType];
  return fillPromptTemplate(template, variables);
}
