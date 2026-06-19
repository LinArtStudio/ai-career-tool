"use client";
import { useState } from "react";
import { searchJobs, searchCompanies } from "@/lib/data/jobs";

export default function ResumeBuilderPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [additional, setAdditional] = useState("");

  const generate = async () => {
    if (!name || !education || !experience) { setError("请填写必填项"); return; }
    setLoading(true); setError("");
    try {
      const basic_info = [
        `姓名：${name}`, phone ? `手机：${phone}` : "", email ? `邮箱：${email}` : "",
        `教育背景：${education}`, `工作/实习经历：${experience}`,
        skills ? `技能：${skills}` : "", additional ? `其他信息：${additional}` : "",
      ].filter(Boolean).join("\n");

      const res = await fetch("/api/demo/resume-builder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basic_info, target_position: targetPosition, target_company: targetCompany }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "生成失败"); return; }
      setResult(data);
      setStep(3);
    } catch { setError("网络错误"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">📝 AI简历生成器</h1>
      <p className="text-gray-600 mb-8">输入你的信息，AI帮你生成专业的中文简历（符合中国HR标准）</p>

      {step === 1 && (
        <div className="bg-white border rounded-xl p-8 space-y-4">
          <h2 className="text-lg font-bold mb-4">基本信息</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">姓名 *</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="张三" /></div>
            <div><label className="block text-sm font-medium mb-1">手机</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="13800138000" /></div>
            <div><label className="block text-sm font-medium mb-1">邮箱</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="zhangsan@email.com" /></div>
            <div><label className="block text-sm font-medium mb-1">目标岗位</label>
            <input value={targetPosition} onChange={e => setTargetPosition(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="前端开发工程师" /></div>
          </div>
          <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">下一步 →</button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border rounded-xl p-8 space-y-4">
          <h2 className="text-lg font-bold mb-4">经历与技能</h2>
          <div><label className="block text-sm font-medium mb-1">教育背景 *</label>
          <textarea value={education} onChange={e => setEducation(e.target.value)} rows={3}
            className="w-full border rounded-lg px-4 py-2 resize-none" placeholder="北京大学 计算机科学与技术 本科 2020-2024&#10;GPA 3.8/4.0，专业排名前10%" /></div>
          <div><label className="block text-sm font-medium mb-1">工作/实习经历 *</label>
          <textarea value={experience} onChange={e => setExperience(e.target.value)} rows={5}
            className="w-full border rounded-lg px-4 py-2 resize-none" placeholder="字节跳动 前端开发实习生 2023.06-2023.12&#10;- 负责抖音小程序核心页面开发&#10;- 主导性能优化，页面加载速度提升30%" /></div>
          <div><label className="block text-sm font-medium mb-1">技能</label>
          <textarea value={skills} onChange={e => setSkills(e.target.value)} rows={2}
            className="w-full border rounded-lg px-4 py-2 resize-none" placeholder="React, TypeScript, Node.js, Python, Git" /></div>
          <div><label className="block text-sm font-medium mb-1">其他信息（项目/证书/兴趣等）</label>
          <textarea value={additional} onChange={e => setAdditional(e.target.value)} rows={2}
            className="w-full border rounded-lg px-4 py-2 resize-none" placeholder="开源项目贡献、竞赛获奖、学生会经历等" /></div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="border px-6 py-2 rounded-lg hover:bg-gray-50">← 上一步</button>
            <button onClick={generate} disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "⏳ AI生成中..." : "🤖 生成简历"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-green-800 mb-2">✅ 简历已生成</h2>
            <p className="text-green-700 text-sm">AI已根据你的信息生成专业简历，可直接复制使用</p>
          </div>

          {result.resume && (
            <div className="bg-white border rounded-xl p-8">
              {/* 个人信息 */}
              <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold">{result.resume.personal_info?.name}</h2>
                <div className="flex gap-4 text-sm text-gray-600 mt-2">
                  {result.resume.personal_info?.phone && <span>📱 {result.resume.personal_info.phone}</span>}
                  {result.resume.personal_info?.email && <span>📧 {result.resume.personal_info.email}</span>}
                  {result.resume.personal_info?.location && <span>📍 {result.resume.personal_info.location}</span>}
                </div>
              </div>

              {/* 求职意向 */}
              {result.resume.objective && (
                <div className="mb-4">
                  <h3 className="font-bold text-blue-700 mb-1">求职意向</h3>
                  <p className="text-sm">{result.resume.objective.target_position} | {result.resume.objective.target_city} | {result.resume.objective.salary_expectation}</p>
                </div>
              )}

              {/* 教育背景 */}
              {result.resume.education?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-blue-700 mb-2">教育背景</h3>
                  {result.resume.education.map((edu: any, i: number) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between"><span className="font-medium">{edu.school}</span><span className="text-sm text-gray-500">{edu.start_date} - {edu.end_date}</span></div>
                      <div className="text-sm text-gray-600">{edu.major} | {edu.degree} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                      {edu.highlights?.length > 0 && <ul className="text-sm text-gray-600 list-disc pl-5">{edu.highlights.map((h: string, j: number) => <li key={j}>{h}</li>)}</ul>}
                    </div>
                  ))}
                </div>
              )}

              {/* 工作经历 */}
              {result.resume.experience?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-blue-700 mb-2">工作/实习经历</h3>
                  {result.resume.experience.map((exp: any, i: number) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between"><span className="font-medium">{exp.company} - {exp.position}</span><span className="text-sm text-gray-500">{exp.start_date} - {exp.end_date}</span></div>
                      <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
                        {exp.responsibilities?.map((r: string, j: number) => <li key={j}>{r}</li>)}
                        {exp.achievements?.map((a: string, j: number) => <li key={j} className="text-green-700">✅ {a}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* 项目经历 */}
              {result.resume.projects?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-blue-700 mb-2">项目经历</h3>
                  {result.resume.projects.map((proj: any, i: number) => (
                    <div key={i} className="mb-2">
                      <div className="font-medium">{proj.name} <span className="text-sm text-gray-500">({proj.role})</span></div>
                      <p className="text-sm text-gray-600">{proj.description}</p>
                      {proj.technologies?.length > 0 && <div className="text-xs text-blue-600 mt-1">技术栈：{proj.technologies.join("、")}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* 技能 */}
              {result.resume.skills && (
                <div className="mb-4">
                  <h3 className="font-bold text-blue-700 mb-2">技能</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {result.resume.skills.technical?.length > 0 && <div><span className="font-medium">技术：</span>{result.resume.skills.technical.join("、")}</div>}
                    {result.resume.skills.tools?.length > 0 && <div><span className="font-medium">工具：</span>{result.resume.skills.tools.join("、")}</div>}
                    {result.resume.skills.languages?.length > 0 && <div><span className="font-medium">语言：</span>{result.resume.skills.languages.join("、")}</div>}
                  </div>
                </div>
              )}

              {/* 自我评价 */}
              {result.resume.self_evaluation && (
                <div className="mb-4">
                  <h3 className="font-bold text-blue-700 mb-2">自我评价</h3>
                  <p className="text-sm text-gray-600">{result.resume.self_evaluation}</p>
                </div>
              )}
            </div>
          )}

          {/* 优化说明 */}
          {result.optimization_notes?.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-2">💡 优化说明</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {result.optimization_notes.map((note: string, i: number) => <li key={i}>• {note}</li>)}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => { setStep(1); setResult(null); }} className="border px-6 py-2 rounded-lg hover:bg-gray-50">重新生成</button>
            <button onClick={() => {
              const text = JSON.stringify(result.resume, null, 2);
              navigator.clipboard.writeText(text);
              alert("已复制到剪贴板");
            }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">📋 复制简历</button>
          </div>
        </div>
      )}
    </div>
  );
}
