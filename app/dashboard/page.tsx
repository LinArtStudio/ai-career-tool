"use client";
import { useState, useEffect } from "react";
import {
  dailyCheckIn,
  hasCheckedInToday,
  getRecentCheckIns,
  getStats,
  getUserProgress,
  type UserProgress,
} from "@/lib/retention";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<boolean[]>([]);
  const [checkInResult, setCheckInResult] = useState<{
    success: boolean;
    message: string;
    points: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const userProgress = getUserProgress();
      const userStats = getStats();
      const isCheckedIn = hasCheckedInToday();
      const recent = getRecentCheckIns();

      setProgress(userProgress);
      setStats(userStats);
      setCheckedIn(isCheckedIn);
      setRecentCheckIns(recent);
    } catch (error) {
      console.error("加载数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = () => {
    if (checkedIn) return;

    const result = dailyCheckIn();
    setCheckInResult(result);

    if (result.success) {
      setCheckedIn(true);
      loadData(); // 重新加载数据
    }
  };

  const getDayLabel = (index: number) => {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return days[date.getDay()];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">加载失败，请刷新页面</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📊 学习仪表盘</h1>
          <p className="text-gray-500">追踪你的学习进度和成就</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalPoints}
            </div>
            <div className="text-sm text-gray-500">总积分</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600">
              {stats.streak}
            </div>
            <div className="text-sm text-gray-500">连续签到</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {stats.totalPractice}
            </div>
            <div className="text-sm text-gray-500">练习次数</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600">
              {stats.achievementCount}
            </div>
            <div className="text-sm text-gray-500">获得成就</div>
          </div>
        </div>

        {/* 每日签到 */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">🎯 每日签到</h2>

          {/* 近7天签到情况 */}
          <div className="flex justify-between mb-4">
            {recentCheckIns.map((checked, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    checked
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {checked ? "✓" : getDayLabel(index)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {getDayLabel(index)}
                </div>
              </div>
            ))}
          </div>

          {/* 签到按钮 */}
          <button
            onClick={handleCheckIn}
            disabled={checkedIn}
            className={`w-full py-3 rounded-lg font-medium transition ${
              checkedIn
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
            }`}
          >
            {checkedIn ? "✅ 今日已签到" : "🎯 立即签到"}
          </button>

          {/* 签到结果 */}
          {checkInResult && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                checkInResult.success
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {checkInResult.message}
            </div>
          )}

          {/* 积分规则 */}
          <div className="mt-4 text-xs text-gray-400">
            <p>积分规则：每日签到+10分，连续签到额外+5分/天（最高+100分）</p>
          </div>
        </div>

        {/* 练习统计 */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">📚 练习统计</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.interviewCount}
              </div>
              <div className="text-sm text-gray-500">模拟面试</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.resumeCount}
              </div>
              <div className="text-sm text-gray-500">简历诊断</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.jdMatchCount}
              </div>
              <div className="text-sm text-gray-500">JD匹配</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.quizCount}
              </div>
              <div className="text-sm text-gray-500">能力测评</div>
            </div>
          </div>

          {/* 平均分 */}
          {stats.avgInterviewScore > 0 && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">模拟面试平均分</span>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.avgInterviewScore}分
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats.avgInterviewScore}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 成就系统 */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">🏆 成就系统</h2>

          {progress && progress.achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {progress.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <h3 className="font-bold text-sm">{achievement.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🎯</div>
              <p>还没有获得成就，继续努力吧！</p>
            </div>
          )}

          {/* 可解锁成就 */}
          <div className="mt-6">
            <h3 className="font-medium text-sm text-gray-500 mb-3">
              待解锁成就
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: "streak_7", name: "一周坚持", icon: "⭐", desc: "连续签到7天" },
                { id: "practice_50", name: "练习达人", icon: "🏆", desc: "完成50次练习" },
                { id: "interview_20", name: "面试高手", icon: "💎", desc: "完成20次面试" },
                { id: "score_80", name: "优秀学员", icon: "🌟", desc: "平均分≥80" },
              ].map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3 opacity-50"
                >
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="font-medium text-xs">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 快速入口 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/quiz"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-sm">能力测评</div>
          </a>
          <a
            href="/interview"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎤</div>
            <div className="font-medium text-sm">模拟面试</div>
          </a>
          <a
            href="/resume"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium text-sm">简历诊断</div>
          </a>
          <a
            href="/jd-match-v2"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-sm">JD诊断</div>
          </a>
        </div>
      </div>
    </div>
  );
}
