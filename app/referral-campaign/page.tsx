"use client";
import { useState, useEffect } from "react";
import {
  getReferralCode,
  getReferralLink,
  getReferralShareText,
  getReferralStats,
} from "@/lib/referral";

export default function ReferralCampaignPage() {
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [shareText, setShareText] = useState("");
  const [stats, setStats] = useState({
    totalInvites: 0,
    completedInvites: 0,
    pendingInvites: 0,
    totalPointsEarned: 0,
    totalFreeInterviews: 0,
    totalFreeResumeRewrite: 0,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 7,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    loadData();
    startCountdown();
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

  const startCountdown = () => {
    // 设置活动结束时间（7天后）
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
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

  const handleShareToWeChat = () => {
    alert("请复制链接后分享到微信");
  };

  const handleShareToWeibo = () => {
    const url = encodeURIComponent(referralLink);
    const text = encodeURIComponent("AI产品经理求职神器，免费测评你的AI职业竞争力！");
    window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${text}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 活动标题 */}
        <div className="text-center mb-8">
          <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🔥 限时活动
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            邀请好友，双方都得奖励！
          </h1>
          <p className="text-gray-600 text-lg">
            邀请好友注册，你和好友都能获得免费功能和积分奖励
          </p>
        </div>

        {/* 倒计时 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-center text-lg font-bold mb-4">⏰ 活动倒计时</h2>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="bg-purple-600 text-white text-3xl font-bold w-16 h-16 rounded-xl flex items-center justify-center">
                {countdown.days}
              </div>
              <div className="text-sm text-gray-500 mt-1">天</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white text-3xl font-bold w-16 h-16 rounded-xl flex items-center justify-center">
                {countdown.hours}
              </div>
              <div className="text-sm text-gray-500 mt-1">时</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white text-3xl font-bold w-16 h-16 rounded-xl flex items-center justify-center">
                {countdown.minutes}
              </div>
              <div className="text-sm text-gray-500 mt-1">分</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white text-3xl font-bold w-16 h-16 rounded-xl flex items-center justify-center">
                {countdown.seconds}
              </div>
              <div className="text-sm text-gray-500 mt-1">秒</div>
            </div>
          </div>
        </div>

        {/* 奖励说明 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 邀请人奖励 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="text-xl font-bold text-purple-600">邀请人奖励</h3>
              <p className="text-gray-500 text-sm">每邀请1位好友</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">100积分</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">免费模拟面试1次（价值¥19.9）</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">免费AI改简历1次（价值¥9.9）</span>
              </li>
            </ul>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold text-purple-600">价值¥29.8</span>
            </div>
          </div>

          {/* 被邀请人奖励 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-blue-600">被邀请人奖励</h3>
              <p className="text-gray-500 text-sm">通过邀请链接注册</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">50积分</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">免费模拟面试1次（价值¥19.9）</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">免费AI改简历1次（价值¥9.9）</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">首次付费9折优惠</span>
              </li>
            </ul>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold text-blue-600">价值¥29.8+</span>
            </div>
          </div>
        </div>

        {/* 邀请统计 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📊 我的邀请统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalInvites}
              </div>
              <div className="text-sm text-gray-500">总邀请数</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.completedInvites}
              </div>
              <div className="text-sm text-gray-500">成功邀请</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stats.totalPointsEarned}
              </div>
              <div className="text-sm text-gray-500">获得积分</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalFreeInterviews}
              </div>
              <div className="text-sm text-gray-500">免费面试</div>
            </div>
          </div>
        </div>

        {/* 邀请链接 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">🔗 我的邀请链接</h2>
          
          {/* 邀请码 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邀请码
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg font-mono text-lg"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {copied ? "✅ 已复制" : "📋 复制"}
              </button>
            </div>
          </div>

          {/* 邀请链接 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邀请链接
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {copied ? "✅ 已复制" : "📋 复制"}
              </button>
            </div>
          </div>

          {/* 分享按钮 */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShareToWeChat}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              💬 分享到微信
            </button>
            <button
              onClick={handleShareToWeibo}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              📢 分享到微博
            </button>
            <button
              onClick={handleCopyShareText}
              className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
            >
              📝 复制分享文案
            </button>
          </div>
        </div>

        {/* 邀请规则 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📋 邀请规则</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">1.</span>
              <span>分享你的邀请链接或邀请码给好友</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">2.</span>
              <span>好友通过你的链接注册账号</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">3.</span>
              <span>好友完成首次付费或完成3次练习</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">4.</span>
              <span>双方自动获得奖励（积分+免费功能）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">5.</span>
              <span>邀请人数无上限，多邀多得</span>
            </li>
          </ul>
        </div>

        {/* 快速入口 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/quiz"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-sm">免费测评</div>
          </a>
          <a
            href="/interview"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎤</div>
            <div className="font-medium text-sm">模拟面试</div>
          </a>
          <a
            href="/dashboard"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-sm">学习仪表盘</div>
          </a>
          <a
            href="/pricing"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">💎</div>
            <div className="font-medium text-sm">定价方案</div>
          </a>
        </div>
      </div>
    </div>
  );
}
