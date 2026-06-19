"use client";
import { useState } from "react";

export default function CoverLetterPage() {
  const [resumeText, setResumeText] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const generate = async () => {
    if (!resumeText) { setError("请粘贴简历内容"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/demo/cover-letter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: resumeText, target_position: targetPosition, target_company: targetCompany, jd }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "生成失败"); return; }
      setResult(data);
    } catch { setError("网络错误"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">✉️ AI求职信生成器</h1>
      <p className="text-gray-600 mb-8">基于简历和目标岗位，AI生成专业的中文求职信/自荐信</p>

      <div className="bg-white border rounded-xl p-8 space-y-4 mb-8">
        <div><label className="block text-sm font-medium mb-1">简历内容 *</label>
        <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={5}
          className="w-full border rounded-lg px-4 py-2 resize-none" placeholder="粘贴你的简历内容..." /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">目标岗位</label>
          <input value={targetPosition} onChange={e => setTargetPosition(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="产品经理" /></div>
          <div><label className="block text-sm font-medium mb-1">目标公司</label>
          <input value={targetCompany} onChange={e => setTargetCompany(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="字节跳动" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">岗位描述(JD)（可选，提高匹配度）</label>
        <textarea value={jd} onChange={e => setJd(e.target.value)} rows={3}
          className="w-full border rounded-lg px-4 py-2 resize-none" placeholder="粘贴岗位描述..." /></div>
        <button onClick={generate} disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? "⏳ 生成中..." : "✉️ 生成求职信"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-8">
            <h3 className="text-lg font-bold mb-4">📄 求职信</h3>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{result.cover_letter}</div>
          </div>
          {result.key_highlights?.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-800 mb-2">🔑 核心亮点</h3>
              <ul className="text-sm text-green-700 space-y-1">{result.key_highlights.map((h: string, i: number) => <li key={i}>✅ {h}</li>)}</ul>
            </div>
          )}
          {result.tips && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-2">💡 使用建议</h3>
              <p className="text-sm text-blue-700">{result.tips}</p>
            </div>
          )}
          <button onClick={() => { navigator.clipboard.writeText(result.cover_letter); alert("已复制"); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">📋 复制求职信</button>
        </div>
      )}
    </div>
  );
}
