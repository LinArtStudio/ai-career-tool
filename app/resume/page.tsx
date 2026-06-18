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

export default function ResumePage() {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 30) {
      setError("请输入至少30个字的简历内容");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/demo/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "分析失败");
        return;
      }
      setResult(data);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch("/api/demo/resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "分析失败");
        return;
      }
      setResult(data);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">📄 AI简历诊断</h1>
      <p className="text-gray-600 mb-8">粘贴简历内容或上传文件，AI从5个维度专业评分</p>

      {/* 输入模式切换 */}
      <div className="flex border rounded-lg overflow-hidden mb-6 max-w-xs">
        <button
          onClick={() => setInputMode("text")}
          className={`flex-1 py-2 text-sm font-medium ${inputMode === "text" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}
        >
          📝 粘贴文本
        </button>
        <button
          onClick={() => setInputMode("file")}
          className={`flex-1 py-2 text-sm font-medium ${inputMode === "file" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}
        >
          📎 上传文件
        </button>
      </div>

      {inputMode === "text" ? (
        <div className="mb-6">
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="请将简历内容粘贴到这里...&#10;&#10;示例：&#10;张三 | 前端开发工程师&#10;手机：138xxxx1234 | 邮箱：zhangsan@email.com&#10;&#10;教育背景&#10;北京大学 计算机科学与技术 本科 2020-2024&#10;&#10;工作经历&#10;字节跳动 前端开发实习生 2023.06-2023.12&#10;- 负责抖音小程序核心页面开发..."
            rows={12}
            className="w-full border rounded-lg px-4 py-3 resize-none text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || resumeText.trim().length < 30}
            className="mt-3 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "⏳ AI分析中（约30秒，请耐心等待）..." : "🔍 开始诊断"}
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="mb-4"
          />
          <p className="text-sm text-gray-500">支持 .txt .pdf 格式</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* 结果展示 */}
      {result && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">{result.score}</div>
            <div className="text-gray-600">综合评分（满分100）</div>
            <div className="text-sm text-gray-500 mt-2">{result.comparison}</div>
          </div>

          {result.dimensions && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">📊 分维度评分</h3>
              <div className="space-y-3">
                {Object.entries(result.dimensions).map(([key, dim]) => (
                  <div key={key} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600">
                      {key === "structure" ? "结构" : key === "content" ? "内容" : key === "keywords" ? "关键词" : key === "impact" ? "量化" : "格式"}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${dim.score}%` }} />
                    </div>
                    <div className="w-12 text-right font-medium">{dim.score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.top_issues?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">⚠️ 主要问题</h3>
              <div className="space-y-3">
                {result.top_issues.map((issue, i) => (
                  <div key={i} className="border-l-4 border-yellow-400 pl-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded mr-2 ${issue.severity === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {issue.severity === "high" ? "严重" : issue.severity === "medium" ? "中等" : "轻微"}
                    </span>
                    <span className="font-medium">{issue.issue}</span>
                    <p className="text-sm text-gray-600 mt-1">💡 {issue.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.optimized_lines?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">✨ 优化建议</h3>
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
        </div>
      )}
    </div>
  );
}
