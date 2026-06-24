"use client";
import { useState, useEffect } from "react";
import {
  getConversionFunnel,
  getPageViewStats,
  getFeatureUsageStats,
} from "@/lib/tracking";

interface FunnelData {
  quizStart: number;
  quizComplete: number;
  signupStart: number;
  signupComplete: number;
  paymentStart: number;
  paymentComplete: number;
  conversionRates: {
    quizToSignup: number;
    signupToPayment: number;
    overall: number;
  };
}

interface PageStat {
  page: string;
  views: number;
  uniqueUsers: number;
}

interface FeatureStat {
  feature: string;
  usage: number;
}

export default function ConversionFunnelPage() {
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);
  const [featureStats, setFeatureStats] = useState<FeatureStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const funnel = getConversionFunnel();
      const pages = getPageViewStats();
      const features = getFeatureUsageStats();

      setFunnelData(funnel);
      setPageStats(pages);
      setFeatureStats(features);
    } catch (error) {
      console.error("加载数据失败:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📊 转化漏斗分析</h1>
          <p className="text-gray-500">监控用户转化路径，优化付费转化率</p>
        </div>

        {/* 转化漏斗 */}
        {funnelData && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">🔄 转化漏斗</h2>
            
            <div className="space-y-4">
              {/* 测评开始 */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {funnelData.quizStart}
                  </div>
                  <div className="text-sm text-gray-500">测评开始</div>
                </div>
                <div className="flex-1 bg-blue-100 rounded-full h-8 relative">
                  <div
                    className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-4"
                    style={{ width: "100%" }}
                  >
                    <span className="text-white text-sm font-medium">100%</span>
                  </div>
                </div>
              </div>

              {/* 测评完成 */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {funnelData.quizComplete}
                  </div>
                  <div className="text-sm text-gray-500">测评完成</div>
                </div>
                <div className="flex-1 bg-green-100 rounded-full h-8 relative">
                  <div
                    className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-4"
                    style={{
                      width: `${
                        funnelData.quizStart > 0
                          ? (funnelData.quizComplete / funnelData.quizStart) * 100
                          : 0
                      }%`,
                    }}
                  >
                    <span className="text-white text-sm font-medium">
                      {funnelData.quizStart > 0
                        ? ((funnelData.quizComplete / funnelData.quizStart) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* 注册开始 */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-right">
                  <div className="text-2xl font-bold text-yellow-600">
                    {funnelData.signupStart}
                  </div>
                  <div className="text-sm text-gray-500">注册开始</div>
                </div>
                <div className="flex-1 bg-yellow-100 rounded-full h-8 relative">
                  <div
                    className="bg-yellow-500 h-8 rounded-full flex items-center justify-end pr-4"
                    style={{
                      width: `${
                        funnelData.quizStart > 0
                          ? (funnelData.signupStart / funnelData.quizStart) * 100
                          : 0
                      }%`,
                    }}
                  >
                    <span className="text-white text-sm font-medium">
                      {funnelData.quizStart > 0
                        ? ((funnelData.signupStart / funnelData.quizStart) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* 注册完成 */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {funnelData.signupComplete}
                  </div>
                  <div className="text-sm text-gray-500">注册完成</div>
                </div>
                <div className="flex-1 bg-orange-100 rounded-full h-8 relative">
                  <div
                    className="bg-orange-500 h-8 rounded-full flex items-center justify-end pr-4"
                    style={{
                      width: `${
                        funnelData.quizStart > 0
                          ? (funnelData.signupComplete / funnelData.quizStart) * 100
                          : 0
                      }%`,
                    }}
                  >
                    <span className="text-white text-sm font-medium">
                      {funnelData.quizStart > 0
                        ? ((funnelData.signupComplete / funnelData.quizStart) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* 支付开始 */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {funnelData.paymentStart}
                  </div>
                  <div className="text-sm text-gray-500">支付开始</div>
                </div>
                <div className="flex-1 bg-red-100 rounded-full h-8 relative">
                  <div
                    className="bg-red-500 h-8 rounded-full flex items-center justify-end pr-4"
                    style={{
                      width: `${
                        funnelData.quizStart > 0
                          ? (funnelData.paymentStart / funnelData.quizStart) * 100
                          : 0
                      }%`,
                    }}
                  >
                    <span className="text-white text-sm font-medium">
                      {funnelData.quizStart > 0
                        ? ((funnelData.paymentStart / funnelData.quizStart) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* 支付完成 */}
              <div className="flex items-center gap-4">
                <div className="w-32 text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {funnelData.paymentComplete}
                  </div>
                  <div className="text-sm text-gray-500">支付完成</div>
                </div>
                <div className="flex-1 bg-purple-100 rounded-full h-8 relative">
                  <div
                    className="bg-purple-500 h-8 rounded-full flex items-center justify-end pr-4"
                    style={{
                      width: `${
                        funnelData.quizStart > 0
                          ? (funnelData.paymentComplete / funnelData.quizStart) * 100
                          : 0
                      }%`,
                    }}
                  >
                    <span className="text-white text-sm font-medium">
                      {funnelData.quizStart > 0
                        ? ((funnelData.paymentComplete / funnelData.quizStart) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 转化率统计 */}
        {funnelData && (
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {funnelData.conversionRates.quizToSignup.toFixed(1)}%
              </div>
              <div className="text-gray-500">测评→注册转化率</div>
              <div className="text-sm text-gray-400 mt-2">
                目标：10-15%
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {funnelData.conversionRates.signupToPayment.toFixed(1)}%
              </div>
              <div className="text-gray-500">注册→付费转化率</div>
              <div className="text-sm text-gray-400 mt-2">
                目标：5-10%
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {funnelData.conversionRates.overall.toFixed(1)}%
              </div>
              <div className="text-gray-500">整体转化率</div>
              <div className="text-sm text-gray-400 mt-2">
                目标：1-3%
              </div>
            </div>
          </div>
        )}

        {/* 页面访问统计 */}
        {pageStats.length > 0 && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">📄 页面访问统计</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">页面</th>
                    <th className="text-right py-3 px-4">浏览量</th>
                    <th className="text-right py-3 px-4">独立用户</th>
                    <th className="text-right py-3 px-4">占比</th>
                  </tr>
                </thead>
                <tbody>
                  {pageStats.slice(0, 10).map((page, index) => {
                    const totalViews = pageStats.reduce((sum, p) => sum + p.views, 0);
                    const percentage = totalViews > 0 ? (page.views / totalViews) * 100 : 0;

                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-sm">
                          {page.page}
                        </td>
                        <td className="text-right py-3 px-4">
                          {page.views}
                        </td>
                        <td className="text-right py-3 px-4">
                          {page.uniqueUsers}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 w-12">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 功能使用统计 */}
        {featureStats.length > 0 && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">🛠️ 功能使用统计</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featureStats.slice(0, 8).map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "📊"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{feature.feature}</div>
                    <div className="text-xs text-gray-500">{feature.usage} 次使用</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 优化建议 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-800 mb-4">💡 优化建议</h2>
          <ul className="space-y-3 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">1.</span>
              <span>
                <strong>测评完成率</strong>：如果测评完成率低于80%，考虑简化测评流程
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">2.</span>
              <span>
                <strong>注册转化率</strong>：如果注册转化率低于10%，考虑简化注册流程
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">3.</span>
              <span>
                <strong>付费转化率</strong>：如果付费转化率低于5%，考虑优化定价策略
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">4.</span>
              <span>
                <strong>功能使用</strong>：关注使用率最高的功能，持续优化体验
              </span>
            </li>
          </ul>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={loadData}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            🔄 刷新数据
          </button>
          <a
            href="/ab-test"
            className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg text-center hover:bg-gray-50 transition"
          >
            查看A/B测试
          </a>
        </div>
      </div>
    </div>
  );
}
