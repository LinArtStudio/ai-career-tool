"use client";
import { useState } from "react";
import { INTERVIEW_DATABASE, getCompanies, getPositions, getCategories } from "@/lib/data/interview-questions";

export default function InterviewBankPage() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [category, setCategory] = useState("");

  const filtered = INTERVIEW_DATABASE.filter(q => {
    if (company && q.company !== company && q.company !== "通用") return false;
    if (position && !q.position.includes(position) && q.position !== "所有岗位") return false;
    if (category && q.category !== category) return false;
    return true;
  });

  const companies = getCompanies();
  const positions = getPositions(company || undefined);
  const categories = getCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">📚 面试真题库</h1>
      <p className="text-gray-600 mb-8">按公司+岗位分类的真实面试题，来自牛客/脉脉/知乎面经</p>

      {/* 筛选器 */}
      <div className="bg-white border rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">公司</label>
            <select value={company} onChange={e => { setCompany(e.target.value); setPosition(""); }}
              className="w-full border rounded-lg px-3 py-2">
              <option value="">全部公司</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">岗位</label>
            <select value={position} onChange={e => setPosition(e.target.value)}
              className="w-full border rounded-lg px-3 py-2">
              <option value="">全部岗位</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">题型</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2">
              <option value="">全部题型</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-500">共 {filtered.length} 道题</div>
      </div>

      {/* 题目列表 */}
      <div className="space-y-4">
        {filtered.map((q, i) => (
          <div key={i} className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{q.company}</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{q.position}</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{q.category}</span>
              <span className={"text-xs px-2 py-0.5 rounded " + (q.difficulty === "hard" ? "bg-red-100 text-red-700" : q.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700")}>
                {q.difficulty === "hard" ? "困难" : q.difficulty === "medium" ? "中等" : "简单"}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2">{q.question}</h3>
            <p className="text-sm text-gray-500">💡 {q.tips}</p>
            <div className="text-xs text-gray-400 mt-2">来源：{q.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
