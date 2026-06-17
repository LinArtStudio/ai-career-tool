"use client";

import { useState } from "react";

interface AnalysisResult {
  id: string;
  score: number;
  summary: string;
  dimensions: Record<string, { score: number; comment: string }>;
  top_issues: Array<{ severity: string; issue: string; fix: string }>;
  optimized_lines: Array<{ original: string; improved: string; reason: string }>;
  comparison: string;
}

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
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
        if (data.upgrade) {
          setError("免费次数已用完，请升级解锁无限使用");
        } else {
          setError(data.error || "分析失败");
        }
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
      <p className="text-gray-600 mb-8">上传简历PDF，AI从5个维度专业评分并给出优化建议</p>

      {/* 上传区域 */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-8">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
          id="resume-input"
        />
        {file && (
          <p className="text-sm text-gray-500 mb-4">
            已选择: {file.name} ({(file.size / 1024).toFixed(1)}KB)
          </p>
        )}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "⏳ AI分析中..." : "🔍 开始诊断"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
          {error}
          {error.includes("升级") && (
            <a href="/pricing" className="ml-2 underline">查看定价 →</a>
          )}
        </div>
      )}

      {/* 结果展示 */}
      {result && (
        <div className="space-y-6">
          {/* 综合评分 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">{result.score}</div>
            <div className="text-gray-600">综合评分（满分100）</div>
            <div className="text-sm text-gray-500 mt-2">{result.comparison}</div>
          </div>

          {/* 各维度评分 */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">📊 分维度评分</h3>
            <div className="space-y-3">
              {Object.entries(result.dimensions).map(([key, dim]) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">
                    {key === "structure" ? "结构" :
                     key === "content" ? "内容" :
                     key === "keywords" ? "关键词" :
                     key === "impact" ? "量化" : "格式"}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <div className="w-12 text-right font-medium">{dim.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 主要问题 */}
          {result.top_issues?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">⚠️ 主要问题</h3>
              <div className="space-y-3">
                {result.top_issues.map((issue, i) => (
                  <div key={i} className="border-l-4 border-yellow-400 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        issue.severity === "high" ? "bg-red-100 text-red-700" :
                        issue.severity === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {issue.severity === "high" ? "严重" :
                         issue.severity === "medium" ? "中等" : "轻微"}
                      </span>
                      <span className="font-medium">{issue.issue}</span>
                    </div>
                    <p className="text-sm text-gray-600">💡 {issue.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 优化建议 */}
          {result.optimized_lines?.length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">✨ 优化建议</h3>
              <div className="space-y-4">
                {result.optimized_lines.map((line, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-red-500 mb-1">原文：{line.original}</div>
                    <div className="text-sm text-green-600 mb-1">优化：{line.improved}</div>
                    <div className="text-xs text-gray-500">原因：{line.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 分享CTA */}
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-4">觉得有帮助？分享给你的同学吧！</p>
            <p className="text-sm text-gray-500">
              你的简历在求职者中排名 <span className="font-bold text-blue-600">前{100 - result.score}%</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
