"use client";
import { useState } from "react";

interface MatchResult {
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  jd_analysis: {
    role_summary: string;
    key_requirements: string[];
    nice_to_have: string[];
  };
}

export default function JDMatchPage() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (resume.trim().length < 20) { setError("请粘贴简历内容"); return; }
    if (jd.trim().length < 20) { setError("请粘贴岗位描述(JD)"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/demo/jd-match", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "分析失败"); return; }
      setResult(data);
    } catch { setError("分析超时，请缩短内容"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">🎯 JD匹配度分析</h1>
      <p className="text-gray-600 mb-8">粘贴简历和岗位描述(JD)，AI分析你的匹配度和差距</p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">📄 你的简历</label>
          <textarea value={resume} onChange={(e) => setResume(e.target.value)}
            placeholder="粘贴简历内容..." rows={10}
            className="w-full border rounded-lg px-4 py-3 resize-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">📋 岗位描述(JD)</label>
          <textarea value={jd} onChange={(e) => setJd(e.target.value)}
            placeholder="粘贴岗位描述..." rows={10}
            className="w-full border rounded-lg px-4 py-3 resize-none text-sm" />
        </div>
      </div>

      <button onClick={analyze} disabled={loading}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
        {loading ? "⏳ 分析中..." : "🔍 分析匹配度"}
      </button>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">{error}</div>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">{result.match_score}%</div>
            <div className="text-gray-600">JD匹配度</div>
          </div>

          {result.jd_analysis && (
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">📋 岗位分析</h3>
              <p className="text-gray-700 mb-3">{result.jd_analysis.role_summary}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">核心要求</h4>
                  <ul className="space-y-1">{result.jd_analysis.key_requirements?.map((r, i) => <li key={i} className="text-sm text-gray-600">• {r}</li>)}</ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">加分项</h4>
                  <ul className="space-y-1">{result.jd_analysis.nice_to_have?.map((r, i) => <li key={i} className="text-sm text-gray-600">• {r}</li>)}</ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-800 mb-3">✅ 已匹配的关键词</h3>
              <div className="flex flex-wrap gap-2">
                {result.matched_keywords?.map((k, i) => <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{k}</span>)}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-800 mb-3">❌ 缺失的关键词</h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords?.map((k, i) => <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">{k}</span>)}
              </div>
            </div>
          </div>

          {result.suggestions?.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-yellow-800 mb-3">💡 优化建议</h3>
              <ul className="space-y-2">{result.suggestions.map((s, i) => <li key={i} className="text-sm text-gray-700">• {s}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
