"use client";
import { useState } from "react";

interface AnalysisResult {
  score: number;
  summary: string;
  dimensions: Record<string, { score: number; comment: string }>;
  top_issues: Array<{ severity: string; issue: string; fix: string }>;
  optimized_lines: Array<{ original: string; improved: string; reason: string }>;
  comparison: string;
}

interface RewriteResult {
  optimized_resume: string;
  key_improvements: string[];
}

export default function ResumePage() {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [rewrite, setRewrite] = useState<RewriteResult | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const analyzeText = async (text: string) => {
    setLoading(true); setError(""); setResult(null); setRewrite(null);
    try {
      const res = await fetch("/api/demo/resume", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "分析失败"); return; }
      setResult(data);
    } catch { setError("分析超时，请缩短简历内容（建议500字以内）"); }
    finally { setLoading(false); }
  };

  const handleRewrite = async () => {
    if (!result || !resumeText) return;
    setRewriting(true); setError("");
    try {
      const res = await fetch("/api/demo/resume", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rewrite", original: resumeText, diagnosis: result }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "优化失败"); return; }
      setRewrite(data);
    } catch { setError("AI优化超时，请缩短简历内容"); }
    finally { setRewriting(false); }
  };

  const handleTextAnalyze = () => {
    if (resumeText.trim().length < 20) { setError("请输入至少20个字"); return; }
    analyzeText(resumeText);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true); setError(""); setResult(null); setRewrite(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch("/api/demo/resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "分析失败"); return; }
      setResult(data);
    } catch { setError("文件解析失败，请尝试粘贴文本内容"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">📄 AI简历诊断</h1>
      <p className="text-gray-600 mb-8">上传简历或粘贴内容，AI从5个维度专业评分并直接帮你改简历</p>

      <div className="flex border rounded-lg overflow-hidden mb-6 max-w-xs">
        <button onClick={() => setInputMode("text")} className={`flex-1 py-2 text-sm font-medium ${inputMode === "text" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>📝 粘贴文本</button>
        <button onClick={() => setInputMode("file")} className={`flex-1 py-2 text-sm font-medium ${inputMode === "file" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>📎 上传文件</button>
      </div>

      {inputMode === "text" ? (
        <div className="mb-6">
          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
            placeholder="请将简历内容粘贴到这里...\n\n示例：\n张三 | 前端开发工程师\n手机：138xxxx1234 | 邮箱：zhangsan@email.com\n\n教育背景\n北京大学 计算机科学与技术 本科 2020-2024\n\n工作经历\n字节跳动 前端开发实习生 2023.06-2023.12\n- 负责抖音小程序核心页面开发\n- 主导性能优化，页面加载速度提升30%"
            rows={12} className="w-full border rounded-lg px-4 py-3 resize-none text-sm" />
          <div className="flex items-center gap-4 mt-3">
            <button onClick={handleTextAnalyze} disabled={loading || resumeText.trim().length < 20}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? "⏳ AI分析中（约30秒）..." : "🔍 开始诊断"}
            </button>
            <span className="text-sm text-gray-400">{resumeText.length} 字</span>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
          <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} className="mb-4" />
          {fileName && <p className="text-sm text-gray-500 mb-2">已选择: {fileName}</p>}
          {loading && <p className="text-sm text-blue-600">⏳ AI分析中（约30秒）...</p>}
          <p className="text-sm text-gray-400 mt-2">支持 .txt .pdf 格式</p>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">{error}</div>}

      {result && (
        <div className="space-y-6">
          {/* 评分 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">{result.score}</div>
            <div className="text-gray-600">综合评分</div>
            <div className="text-sm text-gray-500 mt-2">{result.comparison}</div>
          </div>

          {/* 分维度评分 */}
          {result.dimensions && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">📊 分维度评分</h3>
              <div className="space-y-3">
                {Object.entries(result.dimensions).map(([key, dim]) => (
                  <div key={key} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600">{key === "structure" ? "结构" : key === "content" ? "内容" : key === "keywords" ? "关键词" : key === "impact" ? "量化" : "格式"}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: dim.score + "%" }} /></div>
                    <div className="w-12 text-right font-medium">{dim.score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 主要问题 */}
          {result.top_issues?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">⚠️ 主要问题</h3>
              <div className="space-y-3">
                {result.top_issues.map((issue, i) => (
                  <div key={i} className="border-l-4 border-yellow-400 pl-4 py-2">
                    <span className={"text-xs px-2 py-0.5 rounded mr-2 " + (issue.severity === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700")}>{issue.severity === "high" ? "严重" : issue.severity === "medium" ? "中等" : "轻微"}</span>
                    <span className="font-medium">{issue.issue}</span>
                    <p className="text-sm text-gray-600 mt-1">💡 {issue.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 优化建议 */}
          {result.optimized_lines?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">✨ 逐行优化建议</h3>
              <div className="space-y-4">
                {result.optimized_lines.map((line, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-red-500 mb-1">❌ {line.original}</div>
                    <div className="text-sm text-green-600 mb-1">✅ {line.improved}</div>
                    <div className="text-xs text-gray-500">💬 {line.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI直接改简历 - 核心差异化功能 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">🤖 AI帮你直接改简历</h3>
            <p className="text-gray-600 text-sm mb-4">不只是告诉你怎么改，AI直接帮你输出优化后的完整简历</p>
            {!rewrite ? (
              <button onClick={handleRewrite} disabled={rewriting}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition">
                {rewriting ? "⏳ AI优化中（约30秒）..." : "✨ 一键优化简历"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-medium mb-2">📝 优化后的简历</h4>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded">{rewrite.optimized_resume}</pre>
                </div>
                {rewrite.key_improvements?.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium mb-2">🔑 主要改进点</h4>
                    <ul className="space-y-1">
                      {rewrite.key_improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-gray-700">✅ {imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button onClick={() => { setRewrite(null); }} className="text-sm text-gray-500 hover:text-gray-700">重新优化</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
