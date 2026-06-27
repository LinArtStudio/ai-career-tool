// 多维度面试评估函数

// 评估维度接口
export interface EvaluationDimension {
  name: string;
  score: number; // 0-100
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// 完整评估结果接口
export interface InterviewEvaluation {
  overallScore: number; // 0-100
  dimensions: EvaluationDimension[];
  summary: string;
  recommendations: string[];
}

// 评估维度配置
const EVALUATION_DIMENSIONS = [
  {
    name: '专业能力',
    description: '岗位相关知识和技能',
    weight: 0.3
  },
  {
    name: '逻辑思维',
    description: '分析问题和解决问题的能力',
    weight: 0.25
  },
  {
    name: '沟通表达',
    description: '语言表达和沟通能力',
    weight: 0.25
  },
  {
    name: '性格特质',
    description: '工作态度和性格特点',
    weight: 0.2
  }
];

// 生成评估Prompt
export function generateEvaluationPrompt(
  question: string,
  answer: string,
  jobTitle: string
): string {
  return `请对以下面试回答进行多维度评估：

【职位】：${jobTitle}

【面试问题】：
${question}

【候选人回答】：
${answer}

【评估要求】：
请从以下4个维度进行评估，每个维度0-100分：

1. 专业能力（权重30%）
   - 岗位相关知识掌握程度
   - 技能应用能力
   - 行业理解深度

2. 逻辑思维（权重25%）
   - 问题分析能力
   - 逻辑推理能力
   - 解决方案的合理性

3. 沟通表达（权重25%）
   - 语言表达清晰度
   - 结构化表达能力
   - 沟通效率

4. 性格特质（权重20%）
   - 工作态度
   - 团队协作意识
   - 抗压能力

【输出格式】：
请以JSON格式输出评估结果：
{
  "overall_score": 总分,
  "dimensions": [
    {
      "name": "专业能力",
      "score": 分数,
      "feedback": "详细反馈",
      "strengths": ["优势1", "优势2"],
      "improvements": ["改进建议1", "改进建议2"]
    },
    ...其他维度
  ],
  "summary": "整体评价",
  "recommendations": ["建议1", "建议2", "建议3"]
}

要求：
1. 评估客观公正
2. 反馈具体可操作
3. 使用中文输出`;
}

// 解析评估结果
export function parseEvaluationResult(result: string): InterviewEvaluation | null {
  try {
    // 尝试从JSON字符串中提取
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        overallScore: parsed.overall_score || 0,
        dimensions: parsed.dimensions || [],
        summary: parsed.summary || '',
        recommendations: parsed.recommendations || []
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to parse evaluation result:', error);
    return null;
  }
}

// 获取评估维度配置
export function getEvaluationDimensions() {
  return EVALUATION_DIMENSIONS;
}
