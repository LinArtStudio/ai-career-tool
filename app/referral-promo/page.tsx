"use client";
import { useState, useEffect } from "react";
import {
  getReferralCode,
  getReferralLink,
  getReferralShareText,
  getReferralStats,
} from "@/lib/referral";

export default function ReferralPromoPage() {
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [shareText, setShareText] = useState("");
  const [stats, setStats] = useState({
    totalInvites: 0,
    completedInvites: 0,
    totalPointsEarned: 0,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const userId = "user_" + Date.now();
      const code = getReferralCode(userId);
      const link = getReferralLink(userId);
      const text = getReferralShareText(userId);
      const userStats = getReferralStats(userId);

      setReferralCode(code);
      setReferralLink(link);
      setShareText(text);
      setStats(userStats);
    } catch (error) {
      console.error("加载邀请数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  const handleCopyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert("分享文案已复制！");
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero区域 */}
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            🎁 限时活动
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            邀请好友，双方都赚钱
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            邀请好友注册，你和好友都能获得
            <span className="text-blue-600 font-bold">¥59.5</span>的免费功能
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{stats.totalInvites}</div>
              <div className="text-sm text-gray-500">已邀请</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600">{stats.completedInvites}</div>
              <div className="text-sm text-gray-500">成功邀请</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{stats.totalPointsEarned}</div>
              <div className="text-sm text-gray-500">获得积分</div>
            </div>
          </div>
        </div>

        {/* 奖励说明 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-xl font-bold">邀请人奖励</h3>
              <p className="text-gray-500 text-sm">你获得的奖励</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">100积分</span>
                <span className="text-gray-400 text-sm">可兑换功能</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">免费模拟面试1次</span>
                <span className="text-gray-400 text-sm">价值¥19.9</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">免费AI改简历1次</span>
                <span className="text-gray-400 text-sm">价值¥9.9</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t text-center">
              <div className="text-2xl font-bold text-blue-600">总价值 ¥29.8</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold">被邀请人奖励</h3>
              <p className="text-gray-500 text-sm">好友获得的奖励</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">50积分</span>
                <span className="text-gray-400 text-sm">可兑换功能</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">免费模拟面试1次</span>
                <span className="text-gray-400 text-sm">价值¥19.9</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">免费AI改简历1次</span>
                <span className="text-gray-400 text-sm">价值¥9.9</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">首次付费9折</span>
                <span className="text-gray-400 text-sm">限时优惠</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t text-center">
              <div className="text-2xl font-bold text-purple-600">总价值 ¥29.8+</div>
            </div>
          </div>
        </div>

        {/* 邀请码和链接 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-12">
          <h2 className="text-xl font-bold text-center mb-6">🎯 我的邀请</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邀请码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg font-mono text-lg text-center"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {copied ? "✅ 已复制" : "📋 复制"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邀请链接</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {copied ? "✅ 已复制" : "📋 复制"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleCopyShareText}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              💬 复制分享文案
            </button>
            <button
              onClick={() => {
                const text = encodeURIComponent(shareText);
                window.open(`https://service.weibo.com/share/share.php?title=${text}`);
              }}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              📢 分享到微博
            </button>
          </div>
        </div>

        {/* 邀请规则 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-12">
          <h2 className="text-xl font-bold text-center mb-6">📋 邀请规则</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-3">如何邀请？</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>复制你的邀请链接或邀请码</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>分享给好友（微信、微博、QQ等）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>好友通过你的链接注册账号</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                  <span>好友完成首次付费或3次练习</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                  <span>双方自动获得奖励</span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="font-bold mb-3">常见问题</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-800">邀请人数有上限吗？</p>
                  <p>没有上限，多邀多得！</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">奖励什么时候发放？</p>
                  <p>好友完成注册后立即发放</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">可以邀请自己吗？</p>
                  <p>不可以，需要不同的账号</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 快速入口 */}
        <div className="text-center">
          <a
            href="/referral"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition"
          >
            🎁 查看我的邀请详情
          </a>
        </div>
      </div>
    </div>
  );
}
