"use client";
import { useState } from "react";

interface ResumeInput {
  jobTitle: string;
  jobDescription: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    school: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    role: string;
    achievements: string[];
  }>;
}

export default function ResumeGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("input");

  // 表单状态
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");

  const handleGenerate = async () => {
    // 验证输入
    if (!jobTitle.trim()) {
      setError("请输入目标岗位");
      return;
    }
    if (!jobDescription.trim()) {
      setError("请输入岗位描述(JD)");
      return;
    }
    if (!name.trim()) {
      setError("请输入姓名");
      return;
    }
    if (!email.trim()) {
      setError("请输入邮箱");
      return;
    }
    if (!experience.trim()) {
      setError("请输入工作经历");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // 解析工作经历
      const experienceLines = experience.split("\n").filter(line => line.trim());
      const parsedExperience = experienceLines.map((line, index) => ({
        company: `公司${index + 1}`,
        position: "职位",
        startDate: "2020-01",
        endDate: "至今",
        description: line,
        achievements: [line]
      }));

      // 解析教育背景
      const educationLines = education.split("\n").filter(line => line.trim());
      const parsedEducation = educationLines.map((line, index) => ({
        school: `学校${index + 1}`,
        major: "专业",
        degree: "本科",
        startDate: "2016-09",
        endDate: "2020-06"
      }));

      // 解析技能
      const skillsList = skills.split(/[,，、]/).map(s => s.trim()).filter(s => s);

      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          personalInfo: {
            name,
            email,
            phone,
            location
          },
          experience: parsedExperience,
          education: parsedEducation,
          skills: skillsList,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setActiveTab("result");
      } else {
        setError(data.error || "生成失败");
      }
    } catch (err) {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">📝 AI简历生成器</h1>
        <p className="text-gray-500">输入目标岗位和你的经历，AI帮你生成针对性简历</p>
      </div>

      {/* Tab导航 */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("input")}
          className={`px-6 py-3 font-medium ${
            activeTab === "input"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          📝 输入信息
        </button>
        <button
          onClick={() => setActiveTab("result")}
          disabled={!result}
          className={`px-6 py-3 font-medium ${
            activeTab === "result"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          } ${!result ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          📄 生成结果
        </button>
      </div>

      {/* 输入表单 */}
      {activeTab === "input" && (
        <div className="space-y-6">
          {/* 目标岗位 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">🎯 目标岗位</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">岗位名称 *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="例如：AI产品经理、前端工程师、运营经理"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">岗位描述(JD) *</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="粘贴完整的岗位描述..."
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 个人信息 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">👤 个人信息</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">姓名 *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的姓名"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">邮箱 *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">手机</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="13800138000"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">所在地</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="北京"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 工作经历 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">💼 工作经历 *</h2>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="每行一条工作经历，例如：\n在XX公司担任产品经理，负责XX产品从0到1的全过程\n主导XX项目，用户增长30%，转化率提升15%"
              rows={6}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-2">每行一条经历，AI会自动优化表述</p>
          </div>

          {/* 教育背景 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">🎓 教育背景</h2>
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="每行一条教育经历，例如：\n北京大学 计算机科学 本科\n浙江大学 人工智能 硕士"
              rows={3}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 技能清单 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">🛠️ 技能清单</h2>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="用逗号分隔，例如：\nPython, React, 产品设计, 数据分析, 项目管理"
              rows={3}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              ❌ {error}
            </div>
          )}

          {/* 生成按钮 */}
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  AI正在生成简历...
                </span>
              ) : (
                "🚀 生成针对性简历"
              )}
            </button>
          </div>
        </div>
      )}

      {/* 生成结果 */}
      {activeTab === "result" && result && (
        <div className="space-y-6">
          {/* ATS评分 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {result.resume.atsScore}
            </div>
            <div className="text-gray-600">ATS兼容性评分</div>
            <div className="text-sm text-gray-500 mt-2">
              {result.resume.atsScore >= 80 ? "✅ 优秀，简历通过率很高" :
               result.resume.atsScore >= 60 ? "⚠️ 良好，建议优化关键词" :
               "❌ 需要优化，建议参考优化建议"}
            </div>
          </div>

          {/* 关键词 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">🔑 JD关键词</h3>
            <div className="flex flex-wrap gap-2">
              {result.resume.keywords.map((keyword: string, i: number) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 简历预览 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">📄 简历预览</h3>
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm font-mono">
              {result.resumeText}
            </div>
          </div>

          {/* 优化建议 */}
          {result.resume.suggestions && result.resume.suggestions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-yellow-800 mb-3">💡 优化建议</h3>
              <ul className="space-y-2">
                {result.resume.suggestions.map((suggestion: string, i: number) => (
                  <li key={i} className="text-sm text-yellow-700 flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.resumeText);
                alert("简历已复制到剪贴板！");
              }}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              📋 复制简历
            </button>
            <button
              onClick={() => {
                setActiveTab("input");
                setResult(null);
              }}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
            >
              🔄 重新生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
