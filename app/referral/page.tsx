"use client";
import { useState, useEffect } from "react";
import {
  getReferralCode,
  getReferralLink,
  getReferralShareText,
  getReferralStats,
} from "@/lib/referral";

export default function ReferralPage() {
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      // 使用模拟用户ID（实际应从认证系统获取）
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
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    // 微信分享需要接入微信JS-SDK
    alert("请复制链接后分享到微信");
  };

  const handleShareToWeibo = () => {
    const url = encodeURIComponent(referralLink);
    const text = encodeURIComponent("AI产品经理求职神器，免费测评你的AI职业竞争力！");
    window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${text}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🎁 邀请好友</h1>
          <p className="text-gray-500">邀请好友注册，双方都能获得奖励</p>
        </div>

        {/* 奖励说明 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">🎯 邀请奖励</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-700 mb-2">👤 邀请人奖励</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 100积分
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 免费模拟面试1次（价值¥19.9）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 免费AI改简历1次（价值¥9.9）
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-purple-700 mb-2">👥 被邀请人奖励</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 50积分
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 免费模拟面试1次（价值¥19.9）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 免费AI改简历1次（价值¥9.9）
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 首次付费9折优惠
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 邀请统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalInvites}
            </div>
            <div className="text-sm text-gray-500">总邀请数</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {stats.completedInvites}
            </div>
            <div className="text-sm text-gray-500">成功邀请</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600">
              {stats.totalPointsEarned}
            </div>
            <div className="text-sm text-gray-500">获得积分</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalFreeInterviews}
            </div>
            <div className="text-sm text-gray-500">免费面试</div>
          </div>
        </div>

        {/* 邀请码和链接 */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">🔗 我的邀请</h2>

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
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">📋 邀请规则</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">1.</span>
              <span>分享你的邀请链接或邀请码给好友</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">2.</span>
              <span>好友通过你的链接注册账号</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">3.</span>
              <span>好友完成首次付费或完成3次练习</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">4.</span>
              <span>双方自动获得奖励（积分+免费功能）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">5.</span>
              <span>邀请人数无上限，多邀多得</span>
            </li>
          </ul>
        </div>

        {/* 邀请排行榜（可选） */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">🏆 邀请排行榜</h2>
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🏆</div>
            <p>邀请排行榜即将上线，敬请期待！</p>
          </div>
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
