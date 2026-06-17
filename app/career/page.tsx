"use client";

import { useState } from "react";

interface CareerPath {
  title: string;
  match_score: number;
  description: string;
  salary_range: string;
  growth_potential: string;
  required_skills: string[];
  skill_gaps: string[];
  learning_path: Array<{
    stage: string;
    duration: string;
    actions: string[];
    resources: string[];
  }>;
}

export default function CareerPage() {
  const [major, setMajor] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [advice, setAdvice] = useState("");

  const handleSubmit = async () => {
    if (!major) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/demo/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          major,
          interests: interests.split(/[,，、]/).filter(Boolean),
          skills: skills.split(/[,，、]/).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "生成失败");
        return;
      }

      setPaths(data.career_paths);
      setAdvice(data.overall_advice);
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">🧭 AI职业规划</h1>
      <p className="text-gray-600 mb-8">输入你的背景，AI为你生成个性化职业路径</p>

      {paths.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 max-w-lg mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">你的专业 *</label>
            <input type="text" value={major} onChange={(e) => setMajor(e.target.value)}
              placeholder="例：计算机科学" className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">兴趣领域</label>
            <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)}
              placeholder="例：AI, 产品设计, 数据分析" className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">已有技能</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
              placeholder="例：Python, PS, 写作" className="w-full border rounded-lg px-4 py-2" />
          </div>
          <button onClick={handleSubmit} disabled={!major || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? "⏳ 分析中..." : "🗺️ 生成职业规划"}
          </button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      ) : (
        <div className="space-y-6">
          {advice && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-2">💡 整体建议</h3>
              <p className="text-blue-700">{advice}</p>
            </div>
          )}
          {paths.map((path, i) => (
            <div key={i} className="bg-white border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{path.title}</h3>
                <span className="text-2xl font-bold text-blue-600">{path.match_score}%</span>
              </div>
              <p className="text-gray-600 mb-4">{path.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>💰 薪资：{path.salary_range}</div>
                <div>📈 增长：{path.growth_potential === "high" ? "高" : path.growth_potential === "medium" ? "中" : "低"}</div>
              </div>
              <div className="mb-4">
                <h4 className="font-medium mb-2">需要的技能</h4>
                <div className="flex flex-wrap gap-2">
                  {path.required_skills.map((s, j) => (
                    <span key={j} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              </div>
              {path.skill_gaps.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-red-600">⚠️ 你缺少的技能</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skill_gaps.map((g, j) => (
                      <span key={j} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">{g}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="font-medium mb-3">🗺️ 学习路径</h4>
                {path.learning_path.map((step, j) => (
                  <div key={j} className="border-l-2 border-blue-300 pl-4 mb-4">
                    <div className="font-medium">{step.stage} <span className="text-gray-400 text-sm">({step.duration})</span></div>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      {step.actions.map((a, k) => <li key={k}>• {a}</li>)}
                    </ul>
                    {step.resources.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">📚 {step.resources.join("、")}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center">
            <button onClick={() => { setPaths([]); setAdvice(""); }}
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50">
              重新规划
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
