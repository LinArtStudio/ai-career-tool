"use client";
import { useState } from "react";

// 类型定义
interface MatchScore {
  overall: number;
  skills: number;
  experience: number;
  education: number;
  soft_skills: number;
  level: string;
  level_text: string;
}

interface GapItem {
  item: string;
  importance: string;
  bridgeable: boolean;
  bridge_strategy: string;
  time_estimate: string;
}

interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
  answer_tips: string;
  related_jd_item: string;
}

interface JDMatchResult {
  jd_analysis: {
    role_summary: string;
    core_responsibilities: string[];
    key_requirements: string[];
    nice_to_have: string[];
    hidden_requirements: string[];
    company_culture?: string;
    salary_range?: string;
  };
  match_score: MatchScore;
  keywords: {
    matched: string[];
    missing: string[];
    partially_matched: string[];
    categories: {
      technical_skills: string[];
      soft_skills: string[];
      tools: string[];
      certifications: string[];
      experience_years: string[];
      education: string[];
    };
  };
  gap_analysis: {
    critical_gaps: GapItem[];
    moderate_gaps: GapItem[];
    minor_gaps: GapItem[];
    bridgeable_gaps: string[];
    unbridgeable_gaps: string[];
  };
  resume_optimization: {
    keyword_suggestions: Array<{
      original: string;
      suggested: string;
      reason: string;
    }>;
    experience_suggestions: Array<{
      original: string;
      optimized: string;
      reason: string;
    }>;
    skills_suggestions: Array<{
      skill: string;
      action: string;
      reason: string;
    }>;
    structure_suggestions: string[];
    ats_tips: string[];
  };
  interview_predictions: {
    behavioral_questions: InterviewQuestion[];
    technical_questions: InterviewQuestion[];
    situational_questions: InterviewQuestion[];
    stress_questions: InterviewQuestion[];
    company_specific_questions: InterviewQuestion[];
  };
}

export default function JDMatchV2Page() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JDMatchResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const analyze = async () => {
    if (resume.trim().length < 50) {
      setError("请提供更完整的简历内容（至少50字）");
      return;
    }
    if (jd.trim().length < 50) {
      setError("请提供更完整的岗位描述（至少50字）");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/jd-match-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd }),
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

  // 匹配等级颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case "perfect":
        return "text-green-600 bg-green-100";
      case "high":
        return "text-blue-600 bg-blue-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-orange-600 bg-orange-100";
      case "mismatch":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // 分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  // 难度标签
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">简单</span>;
      case "medium":
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">中等</span>;
      case "hard":
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">困难</span>;
      default:
        return null;
    }
  };

  // 重要性标签
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "critical":
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">关键</span>;
      case "important":
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">重要</span>;
      case "nice-to-have":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">加分</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* 标题区 */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          🎯 JD智能匹配诊断
        </h1>
        <p className="text-gray-600">
          粘贴简历和JD，AI深度分析匹配度、差距、优化建议，并预测面试问题
        </p>
      </div>

      {/* 输入区 */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">📄 你的简历</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="粘贴简历内容，包含工作经历、技能、教育背景等..."
            rows={12}
            className="w-full border rounded-lg px-4 py-3 resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            {resume.length} 字符
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            📋 岗位描述(JD)
          </label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="粘贴目标岗位的JD，包含岗位职责、任职要求等..."
            rows={12}
            className="w-full border rounded-lg px-4 py-3 resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">{jd.length} 字符</p>
        </div>
      </div>

      {/* 分析按钮 */}
      <div className="text-center mb-8">
        <button
          onClick={analyze}
          disabled={loading || resume.length < 50 || jd.length < 50}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> AI智能分析中...
            </span>
          ) : (
            "🔍 开始智能诊断"
          )}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
          ❌ {error}
        </div>
      )}

      {/* 结果展示 */}
      {result && (
        <div className="space-y-6">
          {/* Tab导航 */}
          <div className="flex flex-wrap gap-2 border-b pb-4">
            {[
              { id: "overview", label: "📊 匹配总览", icon: "📊" },
              { id: "jd", label: "📋 JD解析", icon: "📋" },
              { id: "keywords", label: "🔑 关键词", icon: "🔑" },
              { id: "gaps", label: "🎯 差距分析", icon: "🎯" },
              { id: "resume", label: "💡 简历优化", icon: "💡" },
              { id: "interview", label: "🎤 面试预测", icon: "🎤" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: 匹配总览 */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 总分卡 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
                <div className={`text-8xl font-bold mb-4 ${getScoreColor(result.match_score.overall)}`}>
                  {result.match_score.overall}
                </div>
                <div className="text-2xl mb-2">整体匹配度</div>
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${getLevelColor(result.match_score.level)}`}>
                  {result.match_score.level_text}
                </span>
              </div>

              {/* 分维度评分 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "技能匹配", score: result.match_score.skills, icon: "🛠️" },
                  { label: "经验匹配", score: result.match_score.experience, icon: "💼" },
                  { label: "教育匹配", score: result.match_score.education, icon: "🎓" },
                  { label: "软技能匹配", score: result.match_score.soft_skills, icon: "🤝" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white border rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className={`text-3xl font-bold mb-1 ${getScoreColor(item.score)}`}>
                      {item.score}
                    </div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* 快速概览 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-bold text-green-800 mb-2">
                    ✅ 已匹配 ({result.keywords.matched.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.matched.slice(0, 8).map((k, i) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm"
                      >
                        {k}
                      </span>
                    ))}
                    {result.keywords.matched.length > 8 && (
                      <span className="text-green-600 text-sm">
                        +{result.keywords.matched.length - 8}个
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-bold text-red-800 mb-2">
                    ❌ 缺失 ({result.keywords.missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.missing.slice(0, 8).map((k, i) => (
                      <span
                        key={i}
                        className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm"
                      >
                        {k}
                      </span>
                    ))}
                    {result.keywords.missing.length > 8 && (
                      <span className="text-red-600 text-sm">
                        +{result.keywords.missing.length - 8}个
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: JD解析 */}
          {activeTab === "jd" && (
            <div className="space-y-4">
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">📋 岗位概述</h3>
                <p className="text-gray-700">{result.jd_analysis.role_summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-blue-800 mb-3">
                    🎯 核心职责
                  </h3>
                  <ul className="space-y-2">
                    {result.jd_analysis.core_responsibilities.map((r, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-purple-800 mb-3">
                    ✅ 核心要求
                  </h3>
                  <ul className="space-y-2">
                    {result.jd_analysis.key_requirements.map((r, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-3">
                    ⭐ 加分项
                  </h3>
                  <ul className="space-y-2">
                    {result.jd_analysis.nice_to_have.map((r, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        • {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-800 mb-3">
                    🔍 隐性要求
                  </h3>
                  <ul className="space-y-2">
                    {result.jd_analysis.hidden_requirements.map((r, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        • {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI产品经理专项信息 */}
              {result.jd_analysis.ai_pm_specific && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="font-bold text-purple-800 mb-3">
                    🤖 AI产品经理专项要求
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">技术深度要求</h4>
                      <p className="text-sm text-gray-700">{result.jd_analysis.ai_pm_specific.technical_depth}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">产品类型</h4>
                      <p className="text-sm text-gray-700">{result.jd_analysis.ai_pm_specific.product_type}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">核心指标</h4>
                      <p className="text-sm text-gray-700">{result.jd_analysis.ai_pm_specific.key_metrics}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: 关键词分析 */}
          {activeTab === "keywords" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-3">
                    ✅ 已匹配 ({result.keywords.matched.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.matched.map((k, i) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-bold text-red-800 mb-3">
                    ❌ 缺失 ({result.keywords.missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.missing.map((k, i) => (
                      <span
                        key={i}
                        className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-800 mb-3">
                    ⚠️ 部分匹配 ({result.keywords.partially_matched.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.partially_matched.map((k, i) => (
                      <span
                        key={i}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full text-sm"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 关键词分类 */}
              <div className="bg-white border rounded-xl p-6">
                <h3 className="font-bold mb-4">📊 关键词分类</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(result.keywords.categories).map(
                    ([category, keywords]) => (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-2 capitalize">
                          {category.replace(/_/g, " ")}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {keywords.map((k, i) => (
                            <span
                              key={i}
                              className="bg-white px-2 py-1 rounded text-xs"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: 差距分析 */}
          {activeTab === "gaps" && (
            <div className="space-y-4">
              {/* 关键差距 */}
              {result.gap_analysis.critical_gaps.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-bold text-red-800 mb-4">
                    🔴 关键差距（必须弥补）
                  </h3>
                  <div className="space-y-4">
                    {result.gap_analysis.critical_gaps.map((gap, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg p-4 border border-red-100"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{gap.item}</h4>
                          <div className="flex gap-2">
                            {getImportanceBadge(gap.importance)}
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                gap.bridgeable
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {gap.bridgeable ? "可弥补" : "需长期积累"}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>弥补策略：</strong>
                          {gap.bridge_strategy}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>预计时间：</strong>
                          {gap.time_estimate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 中等差距 */}
              {result.gap_analysis.moderate_gaps.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-800 mb-4">
                    🟡 中等差距
                  </h3>
                  <div className="space-y-3">
                    {result.gap_analysis.moderate_gaps.map((gap, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg p-4 border border-yellow-100"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{gap.item}</h4>
                          {getImportanceBadge(gap.importance)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {gap.bridge_strategy}（{gap.time_estimate}）
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 轻微差距 */}
              {result.gap_analysis.minor_gaps.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-4">
                    🟢 轻微差距
                  </h3>
                  <div className="space-y-3">
                    {result.gap_analysis.minor_gaps.map((gap, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg p-4 border border-green-100"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{gap.item}</h4>
                          {getImportanceBadge(gap.importance)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {gap.bridge_strategy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: 简历优化建议 */}
          {activeTab === "resume" && (
            <div className="space-y-4">
              {/* 关键词优化 */}
              {result.resume_optimization.keyword_suggestions.length > 0 && (
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-blue-800 mb-4">
                    🔑 关键词优化建议
                  </h3>
                  <div className="space-y-3">
                    {result.resume_optimization.keyword_suggestions.map(
                      (s, i) => (
                        <div
                          key={i}
                          className="bg-blue-50 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-500 line-through">
                              {s.original}
                            </span>
                            <span>→</span>
                            <span className="text-blue-600 font-medium">
                              {s.suggested}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{s.reason}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 经历描述优化 */}
              {result.resume_optimization.experience_suggestions.length > 0 && (
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-purple-800 mb-4">
                    📝 经历描述优化建议
                  </h3>
                  <div className="space-y-4">
                    {result.resume_optimization.experience_suggestions.map(
                      (s, i) => (
                        <div
                          key={i}
                          className="bg-purple-50 rounded-lg p-4"
                        >
                          <div className="mb-3">
                            <p className="text-sm text-gray-500 mb-1">
                              原文：
                            </p>
                            <p className="text-gray-700 bg-white p-2 rounded">
                              {s.original}
                            </p>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm text-purple-600 mb-1">
                              优化后：
                            </p>
                            <p className="text-purple-700 bg-white p-2 rounded font-medium">
                              {s.optimized}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            💡 {s.reason}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 技能展示优化 */}
              {result.resume_optimization.skills_suggestions.length > 0 && (
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-4">
                    🛠️ 技能展示优化建议
                  </h3>
                  <div className="space-y-3">
                    {result.resume_optimization.skills_suggestions.map(
                      (s, i) => (
                        <div
                          key={i}
                          className="bg-green-50 rounded-lg p-4 flex items-start gap-3"
                        >
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              s.action === "add"
                                ? "bg-blue-100 text-blue-700"
                                : s.action === "emphasize"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {s.action === "add"
                              ? "添加"
                              : s.action === "emphasize"
                              ? "强调"
                              : "重组"}
                          </span>
                          <div>
                            <p className="font-medium">{s.skill}</p>
                            <p className="text-sm text-gray-600">
                              {s.reason}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* ATS优化提示 */}
              {result.resume_optimization.ats_tips.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-800 mb-4">
                    📐 ATS优化提示
                  </h3>
                  <ul className="space-y-2">
                    {result.resume_optimization.ats_tips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-yellow-500">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 6: 面试问题预测（独家功能） */}
          {activeTab === "interview" && (
            <div className="space-y-6">
              {/* 行为面试问题 */}
              {result.interview_predictions.behavioral_questions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-blue-800 mb-4">
                    📌 行为面试问题
                  </h3>
                  <div className="space-y-4">
                    {result.interview_predictions.behavioral_questions.map(
                      (q, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-blue-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              Q{i + 1}: {q.question}
                            </h4>
                            {getDifficultyBadge(q.difficulty)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            关联：{q.related_jd_item}
                          </p>
                          <div className="bg-blue-50 rounded p-3">
                            <p className="text-sm text-blue-800">
                              💡 {q.answer_tips}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 技术面试问题 */}
              {result.interview_predictions.technical_questions.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="font-bold text-purple-800 mb-4">
                    🔧 技术面试问题
                  </h3>
                  <div className="space-y-4">
                    {result.interview_predictions.technical_questions.map(
                      (q, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-purple-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              Q{i + 1}: {q.question}
                            </h4>
                            {getDifficultyBadge(q.difficulty)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            关联：{q.related_jd_item}
                          </p>
                          <div className="bg-purple-50 rounded p-3">
                            <p className="text-sm text-purple-800">
                              💡 {q.answer_tips}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 情景面试问题 */}
              {result.interview_predictions.situational_questions.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-4">
                    🎭 情景面试问题
                  </h3>
                  <div className="space-y-4">
                    {result.interview_predictions.situational_questions.map(
                      (q, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-green-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              Q{i + 1}: {q.question}
                            </h4>
                            {getDifficultyBadge(q.difficulty)}
                          </div>
                          <div className="bg-green-50 rounded p-3">
                            <p className="text-sm text-green-800">
                              💡 {q.answer_tips}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 压力面试问题 */}
              {result.interview_predictions.stress_questions.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-bold text-red-800 mb-4">
                    😰 压力面试问题
                  </h3>
                  <div className="space-y-4">
                    {result.interview_predictions.stress_questions.map(
                      (q, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-red-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              Q{i + 1}: {q.question}
                            </h4>
                            {getDifficultyBadge(q.difficulty)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            关联：{q.related_jd_item}
                          </p>
                          <div className="bg-red-50 rounded p-3">
                            <p className="text-sm text-red-800">
                              💡 {q.answer_tips}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 公司特定问题 */}
              {result.interview_predictions.company_specific_questions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-800 mb-4">
                    🏢 公司特定问题
                  </h3>
                  <div className="space-y-4">
                    {result.interview_predictions.company_specific_questions.map(
                      (q, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-yellow-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              Q{i + 1}: {q.question}
                            </h4>
                            {getDifficultyBadge(q.difficulty)}
                          </div>
                          <div className="bg-yellow-50 rounded p-3">
                            <p className="text-sm text-yellow-800">
                              💡 {q.answer_tips}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* AI产品经理技术深度问题（独家） */}
              {result.interview_predictions.ai_pm_technical_questions && result.interview_predictions.ai_pm_technical_questions.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="font-bold text-purple-800 mb-4">
                    🤖 AI产品经理技术深度问题（独家）
                  </h3>
                  <div className="space-y-4">
                    {result.interview_predictions.ai_pm_technical_questions.map(
                      (q, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-purple-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              Q{i + 1}: {q.question}
                            </h4>
                            {getDifficultyBadge(q.difficulty)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            关联：{q.related_jd_item}
                          </p>
                          {q.knowledge_points && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {q.knowledge_points.map((point, j) => (
                                <span key={j} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                  {point}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="bg-purple-50 rounded p-3">
                            <p className="text-sm text-purple-800">
                              💡 {q.answer_tips}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* AI产品设计问题（独家） */}
              {result.interview_predictions.ai_pm_product_questions && result.interview_predictions.ai_pm_product_questions.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                  <h3 className="font-bold text-indigo-800 mb-4">
                    🎨 AI产品设计问题（独家）
                  </h3>
                  <div className="space-y-4">
                    {result.interview_predictions.ai_pm_product_questions.map(
                      (q, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-indigo-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              Q{i + 1}: {q.question}
                            </h4>
                            {getDifficultyBadge(q.difficulty)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            关联：{q.related_jd_item}
                          </p>
                          {q.knowledge_points && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {q.knowledge_points.map((point, j) => (
                                <span key={j} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                                  {point}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="bg-indigo-50 rounded p-3">
                            <p className="text-sm text-indigo-800">
                              💡 {q.answer_tips}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 重新分析按钮 */}
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setResult(null);
                setActiveTab("overview");
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              🔄 重新分析
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
