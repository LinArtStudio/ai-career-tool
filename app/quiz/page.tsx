"use client";
import { useState } from "react";

// 测评题目
const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "AI工具使用",
    question: "你使用ChatGPT/Claude等AI工具的频率是？",
    options: [
      { text: "从不使用", score: 0 },
      { text: "偶尔使用（每月1-2次）", score: 1 },
      { text: "经常使用（每周1-2次）", score: 2 },
      { text: "每天使用", score: 3 },
    ],
  },
  {
    id: 2,
    category: "AI工具使用",
    question: "你用AI工具完成过以下哪些任务？（多选，每选一个+1分）",
    options: [
      { text: "写邮件/文案", score: 1 },
      { text: "数据分析", score: 1 },
      { text: "代码开发", score: 1 },
      { text: "产品设计（PRD、原型）", score: 1 },
      { text: "以上都没做过", score: 0 },
    ],
  },
  {
    id: 3,
    category: "AI思维认知",
    question: "你知道什么是Prompt Engineering吗？",
    options: [
      { text: "完全不知道", score: 0 },
      { text: "听说过，但不了解", score: 1 },
      { text: "了解基本概念", score: 2 },
      { text: "能设计复杂的Prompt", score: 3 },
    ],
  },
  {
    id: 4,
    category: "AI思维认知",
    question: "你知道RAG（检索增强生成）吗？",
    options: [
      { text: "完全不知道", score: 0 },
      { text: "听说过，但不了解", score: 1 },
      { text: "了解基本原理", score: 2 },
      { text: "能在产品中应用", score: 3 },
    ],
  },
  {
    id: 5,
    category: "AI产品设计",
    question: "你是否设计过AI相关的产品功能？",
    options: [
      { text: "没有", score: 0 },
      { text: "参与过，但不是主导", score: 1 },
      { text: "主导过1个AI功能", score: 2 },
      { text: "主导过多个AI功能", score: 3 },
    ],
  },
  {
    id: 6,
    category: "AI产品设计",
    question: "你知道如何评估AI模型的效果吗？",
    options: [
      { text: "完全不知道", score: 0 },
      { text: "知道一些指标（如准确率）", score: 1 },
      { text: "能设计评估体系", score: 2 },
      { text: "做过A/B测试优化", score: 3 },
    ],
  },
  {
    id: 7,
    category: "AI技术理解",
    question: "你能区分Fine-tuning和RAG的适用场景吗？",
    options: [
      { text: "完全不能", score: 0 },
      { text: "大概知道区别", score: 1 },
      { text: "能说清楚区别", score: 2 },
      { text: "能根据场景选择方案", score: 3 },
    ],
  },
  {
    id: 8,
    category: "AI技术理解",
    question: "你知道什么是AI Agent吗？",
    options: [
      { text: "完全不知道", score: 0 },
      { text: "听说过", score: 1 },
      { text: "了解基本原理", score: 2 },
      { text: "设计过Agent工作流", score: 3 },
    ],
  },
  {
    id: 9,
    category: "AI项目经验",
    question: "你是否有AI产品项目经验？",
    options: [
      { text: "没有", score: 0 },
      { text: "有课程作业/Demo项目", score: 1 },
      { text: "有实习/工作中的AI项目", score: 2 },
      { text: "主导过商用AI产品", score: 3 },
    ],
  },
  {
    id: 10,
    category: "AI项目经验",
    question: "你的AI项目经验能写进简历吗？",
    options: [
      { text: "不能，没有拿得出手的项目", score: 0 },
      { text: "能，但比较基础", score: 1 },
      { text: "能，有完整项目经历", score: 2 },
      { text: "能，有可量化的成果", score: 3 },
    ],
  },
];

// 能力等级定义
const LEVELS = [
  {
    level: "L1",
    name: "AI新手",
    range: [0, 10],
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    description: "你对AI的了解还处于起步阶段，但别担心，每个人都是从零开始的！",
    recommendation: "从通用AI思维与工具基座开始，打好基础",
    path: "ai-basics",
  },
  {
    level: "L2",
    name: "AI入门",
    range: [11, 20],
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "你已经有了基础的AI认知，但还需要系统学习和实战练习。",
    recommendation: "从AI+职业能力重塑工厂开始，快速提升",
    path: "ai-career",
  },
  {
    level: "L3",
    name: "AI进阶",
    range: [21, 30],
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    description: "你已经有了一定的AI能力，可以开始准备AI产品经理岗位了。",
    recommendation: "进入AI产品经理求职训练营，系统准备面试",
    path: "ai-pm",
  },
  {
    level: "L4",
    name: "AI高级",
    range: [31, 40],
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "你的AI能力很强，可以直接进入面试准备阶段。",
    recommendation: "直接进入模拟面试和岗位内推",
    path: "interview",
  },
  {
    level: "L5",
    name: "AI专家",
    range: [41, 50],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "你是AI领域的专家，可以考虑成为导师或创业者。",
    recommendation: "提供内推机会，成为平台导师",
    path: "mentor",
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [level, setLevel] = useState<(typeof LEVELS)[0] | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setSelectedOption(score);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // 计算总分
      const total = Object.values(answers).reduce((sum, score) => sum + score, 0);
      setTotalScore(total);

      // 确定等级
      const userLevel = LEVELS.find(
        (l) => total >= l.range[0] && total <= l.range[1]
      );
      setLevel(userLevel || LEVELS[0]);

      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(answers[QUIZ_QUESTIONS[currentQuestion - 1].id] ?? null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setTotalScore(0);
    setLevel(null);
    setSelectedOption(null);
  };

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  if (showResult && level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 结果卡片 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h1 className="text-3xl font-bold mb-2">你的AI职业竞争力测评结果</h1>
              <p className="text-gray-500">基于10道题目，全面评估你的AI能力水平</p>
            </div>

            {/* 分数展示 */}
            <div className="text-center mb-8">
              <div className={`inline-block px-8 py-4 rounded-2xl ${level.bgColor} ${level.borderColor} border`}>
                <div className="text-6xl font-bold mb-2">{totalScore}</div>
                <div className="text-sm text-gray-500">总分（满分50分）</div>
              </div>
            </div>

            {/* 等级展示 */}
            <div className={`${level.bgColor} ${level.borderColor} border rounded-xl p-6 mb-6`}>
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-4xl font-bold ${level.color}`}>{level.level}</span>
                <div>
                  <h3 className="text-xl font-bold">{level.name}</h3>
                  <p className="text-gray-600">{level.description}</p>
                </div>
              </div>
            </div>

            {/* 能力维度分析 */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">📊 能力维度分析</h3>
              <div className="space-y-3">
                {["AI工具使用", "AI思维认知", "AI产品设计", "AI技术理解", "AI项目经验"].map((category) => {
                  const categoryQuestions = QUIZ_QUESTIONS.filter((q) => q.category === category);
                  const categoryScore = categoryQuestions.reduce(
                    (sum, q) => sum + (answers[q.id] || 0),
                    0
                  );
                  const maxScore = categoryQuestions.length * 3;
                  const percentage = maxScore > 0 ? (categoryScore / maxScore) * 100 : 0;

                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{category}</span>
                        <span>{categoryScore}/{maxScore}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 推荐路径 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-2">🎯 推荐学习路径</h3>
              <p className="text-gray-700 mb-4">{level.recommendation}</p>
              <a
                href={`/${level.path}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                开始学习 →
              </a>
            </div>

            {/* 注册引导 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-2">💡 获取完整报告</h3>
              <p className="text-gray-700 mb-4">
                注册账号即可获取：
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> 完整的能力分析报告
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> 个性化学习路径推荐
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> AI职业转型指南PDF
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> 免费试用付费功能
                </li>
              </ul>
              <a
                href="/login"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
              >
                免费注册获取完整报告
              </a>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                重新测评
              </button>
              <a
                href="/"
                className="flex-1 py-3 bg-gray-600 text-white rounded-lg text-center hover:bg-gray-700 transition"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🎯 AI职业竞争力测评</h1>
          <p className="text-gray-500">10道题，5分钟，了解你的AI能力水平</p>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>进度</span>
            <span>{currentQuestion + 1} / {QUIZ_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 题目卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* 分类标签 */}
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mb-4">
            {question.category}
          </span>

          {/* 题目 */}
          <h2 className="text-xl font-bold mb-6">{question.question}</h2>

          {/* 选项 */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option.score)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                  selectedOption === option.score
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            上一题
          </button>
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "查看结果" : "下一题"}
          </button>
        </div>
      </div>
    </div>
  );
}
