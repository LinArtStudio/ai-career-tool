"use client";
import { useState, useRef, useEffect } from "react";
import { searchJobs, searchCompanies } from "@/lib/data/jobs";
import { searchQuestions, getRandomQuestions } from "@/lib/data/interview-questions";
import { addRecord, getProgress, getRecentRecords } from "@/lib/progress";

interface Question { id: string; question: string; category: string; difficulty: string; tips: string; }
interface Evaluation { score: number; strengths: string[]; weaknesses: string[]; improved_answer: string; key_points: string[]; interviewer_notes?: string; }

function AutoComplete({ value, onChange, placeholder, suggestions, icon }: {
  value: string; onChange: (v: string) => void; placeholder: string;
  suggestions: (q: string) => string[]; icon: string;
}) {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (v: string) => { onChange(v); setItems(suggestions(v)); setShow(true); };
  const handleFocus = () => { setItems(suggestions(value)); setShow(true); };
  const handleSelect = (v: string) => { onChange(v); setShow(false); };

  return (
    <div ref={ref} className="relative">
      <input type="text" value={value} onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus} placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-2.5 pr-10 text-base" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      {show && items.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {items.map((item, i) => (
            <div key={i} onClick={() => handleSelect(item)}
              className="px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
  const [scores, setScores] = useState<number[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [mode, setMode] = useState<"ai" | "bank">("ai");
  const [followup, setFollowup] = useState<{question: string; type: string; reason: string} | null>(null);
  const [followupAnswer, setFollowupAnswer] = useState("");
  const [followupEvaluation, setFollowupEvaluation] = useState<Evaluation | null>(null);
  const [followupLoading, setFollowupLoading] = useState(false);

  const progress = typeof window !== "undefined" ? getProgress() : null;
  const recentRecords = typeof window !== "undefined" ? getRecentRecords(10) : [];

  const generateQuestions = async () => {
    if (!jobTitle) return;
    setLoading(true); setError("");

    if (mode === "bank") {
      // Use question bank
      const bankQuestions = getRandomQuestions(5, company || undefined, jobTitle);
      if (bankQuestions.length > 0) {
        setQuestions(bankQuestions.map(q => ({ id: q.id, question: q.question, category: q.category, difficulty: q.difficulty, tips: q.tips })));
        setCurrentIdx(0); setScores([]); setEvaluation(null); setAnswer("");
        setLoading(false);
        return;
      }
    }

    // AI generate (with bank supplement)
    try {
      const bankQ = searchQuestions(company || undefined, jobTitle);
      const bankHint = bankQ.length > 0 ? `\n\n参考以下真实面试题风格：\n${bankQ.slice(0, 3).map(q => `- [${q.company}] ${q.question}`).join("\n")}` : "";

      const res = await fetch("/api/demo/interview", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", jobTitle, company, count: 5, bankHint }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "生成失败"); return; }
      setQuestions(data.questions || []);
      setCurrentIdx(0); setScores([]); setEvaluation(null); setAnswer("");
    } catch { setError("网络错误"); }
    finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true); setEvaluation(null);
    try {
      const q = questions[currentIdx];
      const res = await fetch("/api/demo/interview", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate", question: q.question, answer, jobTitle, company }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "评估失败"); return; }
      setEvaluation(data);
      const newScores = [...scores, data.score];
      setScores(newScores);

      // Save to progress
      addRecord({
        type: "interview",
        company: company || undefined,
        position: jobTitle,
        score: data.score,
        details: { category: q.category, difficulty: q.difficulty, question: q.question },
      });
    } catch { setError("网络错误"); }
    finally { setLoading(false); }
  };

  const nextQuestion = () => { 
    setCurrentIdx(currentIdx + 1); 
    setAnswer(""); 
    setEvaluation(null); 
    setFollowup(null);
    setFollowupAnswer("");
    setFollowupEvaluation(null);
  };

  const requestFollowup = async () => {
    if (!evaluation) return;
    setFollowupLoading(true);
    try {
      const q = questions[currentIdx];
      const res = await fetch("/api/demo/interview", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "followup", question: q.question, answer, jobTitle, company }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "追问生成失败"); return; }
      setFollowup(data);
    } catch { setError("网络错误"); }
    finally { setFollowupLoading(false); }
  };

  const submitFollowupAnswer = async () => {
    if (!followupAnswer.trim() || !followup) return;
    setFollowupLoading(true);
    try {
      const q = questions[currentIdx];
      const res = await fetch("/api/demo/interview", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate", question: followup.question, answer: followupAnswer, jobTitle, company }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "评估失败"); return; }
      setFollowupEvaluation(data);
      
      // 保存追问记录到进度
      addRecord({
        type: "interview",
        company: company || undefined,
        position: jobTitle,
        score: data.score,
        details: { category: "追问", difficulty: "hard", question: followup.question },
      });
    } catch { setError("网络错误"); }
    finally { setFollowupLoading(false); }
  };
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">🎤 AI模拟面试</h1>
          <p className="text-gray-600 text-sm md:text-base">输入目标岗位，AI生成真实面试题并评估</p>
        </div>
        <button onClick={() => setShowProgress(!showProgress)}
          className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 self-start">
          📊 {showProgress ? "返回面试" : "练习进度"}
        </button>
      </div>

      {/* Progress Dashboard */}
      {showProgress && progress && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.totalSessions}</div>
              <div className="text-xs text-gray-500">总练习次数</div>
            </div>
            <div className="bg-white border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{progress.averageScore}</div>
              <div className="text-xs text-gray-500">平均分</div>
            </div>
            <div className="bg-white border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{progress.streak}</div>
              <div className="text-xs text-gray-500">连续练习天数</div>
            </div>
            <div className="bg-white border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(progress.companyBreakdown).length}</div>
              <div className="text-xs text-gray-500">练习公司数</div>
            </div>
          </div>

          {/* Score Trend */}
          {progress.recentScores.length > 1 && (
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-medium mb-3 text-sm">📈 近期分数趋势</h3>
              <div className="flex items-end gap-1 h-20">
                {progress.recentScores.map((s, i) => (
                  <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${s}%`, opacity: 0.5 + (i / progress.recentScores.length) * 0.5 }} />
                ))}
              </div>
            </div>
          )}

          {/* Company Breakdown */}
          {Object.keys(progress.companyBreakdown).length > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-medium mb-3 text-sm">🏢 按公司统计</h3>
              <div className="space-y-2">
                {Object.entries(progress.companyBreakdown).sort((a, b) => b[1].avgScore - a[1].avgScore).map(([c, d]) => (
                  <div key={c} className="flex items-center justify-between text-sm">
                    <span>{c}</span>
                    <span className="text-gray-500">{d.count}次 · 平均{d.avgScore}分</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      {!showProgress && questions.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 md:p-8 max-w-lg mx-auto">
          {/* Mode Toggle */}
          <div className="flex border rounded-lg overflow-hidden mb-6">
            <button onClick={() => setMode("ai")} className={`flex-1 py-2 text-sm font-medium ${mode === "ai" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>🤖 AI生成</button>
            <button onClick={() => setMode("bank")} className={`flex-1 py-2 text-sm font-medium ${mode === "bank" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>📚 真题库</button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">目标岗位 *</label>
            <AutoComplete value={jobTitle} onChange={setJobTitle}
              placeholder="输入岗位名称" suggestions={searchJobs} icon="💼" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">目标公司</label>
            <AutoComplete value={company} onChange={setCompany}
              placeholder="输入公司名称" suggestions={searchCompanies} icon="🏢" />
          </div>
          <button onClick={generateQuestions} disabled={!jobTitle || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? "⏳ 生成中..." : mode === "bank" ? "📚 从真题库出题" : "🎯 AI生成面试题"}
          </button>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
      ) : !showProgress && currentIdx >= questions.length ? (
        <div className="text-center py-8 md:py-12">
          <div className="text-5xl md:text-6xl mb-4">🎉</div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">面试完成！</h2>
          <p className="text-gray-600 mb-4">你的平均得分</p>
          <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">{avgScore}分</div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setQuestions([]); setScores([]); }}
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50">再来一轮</button>
            <button onClick={() => setShowProgress(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">📊 查看进度</button>
          </div>
        </div>
      ) : !showProgress ? (
        <div className="space-y-4 md:space-y-6">
          {/* Progress bar */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>问题 {currentIdx + 1}/{questions.length}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(currentIdx / questions.length) * 100}%` }} />
            </div>
            {scores.length > 0 && <span>平均: {avgScore}分</span>}
          </div>

          {/* Question card */}
          <div className="bg-white border rounded-xl p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{questions[currentIdx].category}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${questions[currentIdx].difficulty === "hard" ? "bg-red-100 text-red-700" : questions[currentIdx].difficulty === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                {questions[currentIdx].difficulty === "hard" ? "困难" : questions[currentIdx].difficulty === "medium" ? "中等" : "简单"}
              </span>
              {company && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{company}</span>}
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">{questions[currentIdx].question}</h3>
            <p className="text-sm text-gray-500">💡 {questions[currentIdx].tips}</p>
          </div>

          {/* Answer input */}
          <div>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
              placeholder="输入你的回答...（建议使用STAR法则：情境-任务-行动-结果）" rows={5}
              className="w-full border rounded-lg px-4 py-3 resize-none text-base" />
            <button onClick={submitAnswer} disabled={!answer.trim() || loading}
              className="mt-3 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition w-full sm:w-auto">
              {loading ? "⏳ 评估中..." : "📤 提交回答"}
            </button>
          </div>

          {/* Evaluation result */}
          {evaluation && (
            <div className="bg-white border rounded-xl p-5 md:p-6 space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{evaluation.score}</div>
                <div className="text-sm text-gray-500">本次得分</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ 优点</h4>
                  <ul className="text-sm text-green-700 space-y-1">{evaluation.strengths?.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">⚠️ 不足</h4>
                  <ul className="text-sm text-red-700 space-y-1">{evaluation.weaknesses?.map((w, i) => <li key={i}>• {w}</li>)}</ul>
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

              {/* 追问功能 */}
              {!followup && (
                <button onClick={requestFollowup} disabled={followupLoading}
                  className="w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition disabled:opacity-50">
                  {followupLoading ? "⏳ 生成追问中..." : "🎯 面试官追问"}
                </button>
              )}

              {/* 追问问题 */}
              {followup && (
                <div className="bg-orange-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-orange-800">🤔 面试官追问</h4>
                    <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded">
                      {followup.type === "clarify" ? "澄清" : 
                       followup.type === "detail" ? "细节" : 
                       followup.type === "logic" ? "逻辑" : "压力"}
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 font-medium">{followup.question}</p>
                  <p className="text-xs text-orange-500">💡 {followup.reason}</p>
                  
                  {!followupEvaluation && (
                    <div>
                      <textarea 
                        value={followupAnswer} 
                        onChange={(e) => setFollowupAnswer(e.target.value)}
                        placeholder="输入你的追问回答..." 
                        rows={3}
                        className="w-full border rounded-lg px-4 py-3 resize-none text-base" />
                      <button 
                        onClick={submitFollowupAnswer} 
                        disabled={!followupAnswer.trim() || followupLoading}
                        className="mt-3 bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 transition w-full sm:w-auto">
                        {followupLoading ? "⏳ 评估中..." : "📤 提交追问回答"}
                      </button>
                    </div>
                  )}

                  {/* 追问评估结果 */}
                  {followupEvaluation && (
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">{followupEvaluation.score}</div>
                        <div className="text-sm text-gray-500">追问得分</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-lg p-3">
                          <h5 className="font-medium text-green-800 mb-1 text-sm">✅ 优点</h5>
                          <ul className="text-xs text-green-700 space-y-1">{followupEvaluation.strengths?.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <h5 className="font-medium text-red-800 mb-1 text-sm">⚠️ 不足</h5>
                          <ul className="text-xs text-red-700 space-y-1">{followupEvaluation.weaknesses?.map((w, i) => <li key={i}>• {w}</li>)}</ul>
                        </div>
                      </div>
                      {followupEvaluation.improved_answer && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h5 className="font-medium text-blue-800 mb-1 text-sm">📝 参考答案</h5>
                          <p className="text-xs text-blue-700">{followupEvaluation.improved_answer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button onClick={nextQuestion}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition">
                下一题 →
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
