"use client";

import { useState } from "react";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  tips: string;
}

interface Evaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improved_answer: string;
  key_points: string[];
  interviewer_notes?: string;
}

export default function InterviewPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [scores, setScores] = useState<number[]>([]);

  const generateQuestions = async () => {
    if (!jobTitle) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/demo/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", jobTitle, company, count: 5 }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "生成失败");
        return;
      }

      setQuestions(data.questions);
      setSessionId("demo-" + Date.now());
      setCurrentIdx(0);
      setScores([]);
      setEvaluation(null);
      setAnswer("");
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setEvaluation(null);

    try {
      const q = questions[currentIdx];
      const res = await fetch("/api/demo/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate",
          session_id: sessionId,
          question_id: q.id,
          question: q.question,
          answer,
          jobTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "评估失败");
        return;
      }

      setEvaluation(data);
      setScores([...scores, data.score]);
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setCurrentIdx(currentIdx + 1);
    setAnswer("");
    setEvaluation(null);
  };

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">🎤 AI模拟面试</h1>
      <p className="text-gray-600 mb-8">输入目标岗位，AI为你生成专属面试题并评估回答</p>

      {questions.length === 0 ? (
        /* 输入表单 */
        <div className="bg-white border rounded-xl p-8 max-w-lg mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">目标岗位 *</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="例：前端开发工程师"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">目标公司（可选）</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="例：字节跳动"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <button
            onClick={generateQuestions}
            disabled={!jobTitle || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "⏳ 生成中..." : "🎯 生成面试题"}
          </button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      ) : currentIdx >= questions.length ? (
        /* 面试结束 */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">面试完成！</h2>
          <p className="text-gray-600 mb-4">你的平均得分</p>
          <div className="text-5xl font-bold text-blue-600 mb-6">{avgScore}分</div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setQuestions([]); setScores([]); }}
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50"
            >
              再来一轮
            </button>
            <a href="/pricing" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              解锁更多功能
            </a>
          </div>
        </div>
      ) : (
        /* 面试进行中 */
        <div className="space-y-6">
          {/* 进度 */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>问题 {currentIdx + 1}/{questions.length}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
              />
            </div>
            {scores.length > 0 && <span>平均: {avgScore}分</span>}
          </div>

          {/* 问题卡片 */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {questions[currentIdx].category}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                questions[currentIdx].difficulty === "hard" ? "bg-red-100 text-red-700" :
                questions[currentIdx].difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-green-100 text-green-700"
              }`}>
                {questions[currentIdx].difficulty === "hard" ? "困难" :
                 questions[currentIdx].difficulty === "medium" ? "中等" : "简单"}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{questions[currentIdx].question}</h3>
            <p className="text-sm text-gray-500">💡 提示：{questions[currentIdx].tips}</p>
          </div>

          {/* 回答输入 */}
          <div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="输入你的回答..."
              rows={6}
              className="w-full border rounded-lg px-4 py-3 resize-none"
            />
            <button
              onClick={submitAnswer}
              disabled={!answer.trim() || loading}
              className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "⏳ 评估中..." : "📤 提交回答"}
            </button>
          </div>

          {/* 评估结果 */}
          {evaluation && (
            <div className="bg-white border rounded-xl p-6 space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{evaluation.score}</div>
                <div className="text-sm text-gray-500">本次得分</div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ 优点</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {evaluation.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">⚠️ 不足</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {evaluation.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">📝 参考答案</h4>
                <p className="text-sm text-blue-700">{evaluation.improved_answer}</p>
              </div>
              {evaluation.interviewer_notes && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">👔 面试官视角</h4>
                  <p className="text-sm text-purple-700">{evaluation.interviewer_notes}</p>
                </div>
              )}

              <button
                onClick={nextQuestion}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                下一题 →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
