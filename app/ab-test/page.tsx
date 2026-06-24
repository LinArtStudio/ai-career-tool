"use client";
import { useState, useEffect } from "react";
import {
  AB_TESTS,
  getTestStats,
  assignTestVariant,
  type ABTestConfig,
} from "@/lib/ab-test";

interface TestStats {
  totalUsers: number;
  variants: Array<{
    id: string;
    name: string;
    users: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  }>;
}

export default function ABTestDashboardPage() {
  const [selectedTest, setSelectedTest] = useState<string>("pricing_test");
  const [testStats, setTestStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestStats();
  }, [selectedTest]);

  const loadTestStats = () => {
    setLoading(true);
    try {
      const stats = getTestStats(selectedTest);
      setTestStats(stats);
    } catch (error) {
      console.error("加载测试统计失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const test = AB_TESTS[selectedTest];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📊 A/B测试仪表盘</h1>
          <p className="text-gray-500">监控和分析A/B测试结果，优化付费转化</p>
        </div>

        {/* 测试选择 */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">选择测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(AB_TESTS).map(([testId, testConfig]) => (
              <button
                key={testId}
                onClick={() => setSelectedTest(testId)}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedTest === testId
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="font-bold text-sm">{testConfig.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {testConfig.description}
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  状态：{testConfig.status === "running" ? "运行中" : "已完成"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 测试详情 */}
        {test && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{test.name}</h2>
                <p className="text-gray-500 text-sm">{test.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  test.status === "running"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {test.status === "running" ? "🟢 运行中" : "⏹️ 已完成"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testStats?.totalUsers || 0}
                </div>
                <div className="text-sm text-gray-500">参与用户</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {test.variants.length}
                </div>
                <div className="text-sm text-gray-500">测试变体</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {test.trafficAllocation}%
                </div>
                <div className="text-sm text-gray-500">流量分配</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {test.startDate}
                </div>
                <div className="text-sm text-gray-500">开始日期</div>
              </div>
            </div>
          </div>
        )}

        {/* 变体统计 */}
        {testStats && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">📈 变体统计</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">变体</th>
                    <th className="text-right py-3 px-4">用户数</th>
                    <th className="text-right py-3 px-4">转化数</th>
                    <th className="text-right py-3 px-4">转化率</th>
                    <th className="text-right py-3 px-4">收入</th>
                    <th className="text-center py-3 px-4">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {testStats.variants.map((variant, index) => {
                    const isWinner =
                      testStats.variants.length > 1 &&
                      variant.conversionRate ===
                        Math.max(
                          ...testStats.variants.map((v) => v.conversionRate)
                        );

                    return (
                      <tr key={variant.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-blue-500"
                                  : index === 1
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                              }`}
                            />
                            <span className="font-medium">{variant.name}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          {variant.users}
                        </td>
                        <td className="text-right py-3 px-4">
                          {variant.conversions}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span
                            className={`font-medium ${
                              variant.conversionRate > 10
                                ? "text-green-600"
                                : variant.conversionRate > 5
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {variant.conversionRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          ¥{variant.revenue.toFixed(2)}
                        </td>
                        <td className="text-center py-3 px-4">
                          {isWinner && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              🏆 领先
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 变体详情 */}
        {test && (
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {test.variants.map((variant, index) => (
              <div
                key={variant.id}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`w-4 h-4 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                        ? "bg-green-500"
                        : "bg-purple-500"
                    }`}
                  />
                  <h3 className="font-bold">{variant.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {variant.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">流量权重</span>
                    <span className="font-medium">{variant.weight}%</span>
                  </div>
                  {variant.config.interviewPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">模拟面试价格</span>
                      <span className="font-medium">
                        ¥{variant.config.interviewPrice}
                      </span>
                    </div>
                  )}
                  {variant.config.sprintMonthly && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">月卡价格</span>
                      <span className="font-medium">
                        ¥{variant.config.sprintMonthly}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 测试建议 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-800 mb-4">
            💡 测试建议
          </h2>
          <ul className="space-y-3 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">1.</span>
              <span>
                <strong>样本量</strong>：每个变体至少需要100个用户才能得出可靠结论
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">2.</span>
              <span>
                <strong>测试时长</strong>：建议至少运行1周，避免周末效应
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">3.</span>
              <span>
                <strong>统计显著性</strong>：转化率差异需超过5%才有意义
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">4.</span>
              <span>
                <strong>单一变量</strong>：每次只测试一个变量，避免混淆
              </span>
            </li>
          </ul>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={loadTestStats}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            🔄 刷新数据
          </button>
          <a
            href="/pricing"
            className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg text-center hover:bg-gray-50 transition"
          >
            查看定价页面
          </a>
        </div>
      </div>
    </div>
  );
}
