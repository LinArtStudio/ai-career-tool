"use client";
import { useState, useEffect } from "react";
import { getCurrentUser, signOut, type User } from "@/lib/auth";
import { getProgress, syncProgress, type ProgressSummary } from "@/lib/progress-sync";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; synced: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, progressData] = await Promise.all([
        getCurrentUser(),
        getProgress()
      ]);
      setUser(userData);
      setProgress(progressData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await syncProgress();
      setSyncResult(result);
      // 重新加载数据
      await loadData();
    } catch (error) {
      console.error('同步失败:', error);
      setSyncResult({ success: false, synced: 0 });
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold mb-4">未登录</h1>
          <p className="text-gray-500 mb-6">登录后可同步数据到云端，多设备使用</p>
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            立即登录
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
              {user.nickname?.[0] || '用'}
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.nickname || '用户'}</h1>
              <p className="text-gray-500 text-sm">{user.email || user.phone || '未绑定'}</p>
              {user.is_premium && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  👑 付费用户
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{progress?.totalSessions || 0}</div>
              <div className="text-xs text-gray-500">面试练习次数</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{progress?.averageScore || 0}</div>
              <div className="text-xs text-gray-500">平均分数</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{progress?.streak || 0}</div>
              <div className="text-xs text-gray-500">连续练习天数</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {progress?.companyBreakdown ? Object.keys(progress.companyBreakdown).length : 0}
              </div>
              <div className="text-xs text-gray-500">练习公司数</div>
            </div>
          </div>
        </div>

        {/* 数据同步卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">☁️ 数据同步</h2>
          <p className="text-gray-500 text-sm mb-4">
            同步本地数据到云端，可在多设备间共享数据
          </p>

          {syncResult && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              syncResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {syncResult.success 
                ? `✅ 同步成功！同步了 ${syncResult.synced} 条记录`
                : '❌ 同步失败，请重试'}
            </div>
          )}

          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {syncing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> 同步中...
              </span>
            ) : (
              "🔄 同步本地数据到云端"
            )}
          </button>
        </div>

        {/* 公司练习统计 */}
        {progress?.companyBreakdown && Object.keys(progress.companyBreakdown).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">🏢 公司练习统计</h2>
            <div className="space-y-3">
              {Object.entries(progress.companyBreakdown)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 10)
                .map(([company, stats]) => (
                  <div key={company} className="flex items-center justify-between">
                    <span className="text-sm">{company}</span>
                    <span className="text-sm text-gray-500">
                      {stats.count}次 · 平均{stats.avgScore}分
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="space-y-3">
          <a
            href="/interview"
            className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-center hover:shadow-lg transition-all"
          >
            🎤 开始模拟面试
          </a>
          <a
            href="/resume"
            className="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium text-center hover:bg-blue-50 transition-colors"
          >
            📄 简历诊断
          </a>
          <button
            onClick={handleLogout}
            className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
