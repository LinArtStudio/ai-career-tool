"use client";
import { useState } from "react";

// 产品配置
const PRODUCTS = [
  {
    key: "quiz",
    name: "AI职业竞争力测评",
    priceCNY: 0,
    description: "5分钟了解你的AI能力水平",
    icon: "🎯",
    category: "free",
    features: ["能力图谱", "个性化路径", "短板分析"],
  },
  {
    key: "resume_diagnosis",
    name: "简历诊断",
    priceCNY: 0,
    description: "5维度评分 + 优化建议",
    icon: "📄",
    category: "free",
    features: ["每天3次", "5维度评分", "优化建议"],
  },
  {
    key: "jd_match",
    name: "JD匹配分析",
    priceCNY: 0,
    description: "匹配度百分比 + 关键词差距",
    icon: "🎯",
    category: "free",
    features: ["每天3次", "关键词匹配", "差距分析"],
  },
  {
    key: "interview_preview",
    name: "模拟面试预览",
    priceCNY: 0,
    description: "每天1道面试题",
    icon: "🎤",
    category: "free",
    features: ["每天1题", "AI评估", "回答思路"],
  },
  {
    key: "resume_rewrite",
    name: "AI改简历",
    priceCNY: 71.3,
    description: "一键优化简历，AI专业改写",
    icon: "✨",
    category: "single",
    hot: false,
  },
  {
    key: "resume_generate",
    name: "AI生成简历",
    priceCNY: 143.3,
    description: "从零生成完整专业简历",
    icon: "📝",
    category: "single",
    hot: false,
  },
  {
    key: "interview_full",
    name: "AI模拟面试",
    priceCNY: 143.3,
    description: "5道定制题+评分+面试官视角",
    icon: "🎤",
    category: "single",
    hot: true,
  },
  {
    key: "cover_letter",
    name: "AI求职信",
    priceCNY: 71.3,
    description: "基于简历+JD定制求职信",
    icon: "✉️",
    category: "single",
    hot: false,
  },
  {
    key: "sprint_weekly",
    name: "冲刺卡-周卡",
    priceCNY: 143.3,
    description: "全功能无限使用7天",
    icon: "🔥",
    category: "sprint",
  },
  {
    key: "sprint_monthly",
    name: "冲刺卡-月卡",
    priceCNY: 287.3,
    description: "全功能无限使用30天",
    icon: "⚡",
    category: "sprint",
    recommended: true,
  },
  {
    key: "sprint_quarterly",
    name: "冲刺卡-季卡",
    priceCNY: 575.3,
    description: "全功能无限使用90天",
    icon: "💎",
    category: "sprint",
  },
  {
    key: "lifetime",
    name: "终身会员",
    priceCNY: 921.6,
    description: "一次付费，永久使用所有功能",
    icon: "👑",
    category: "lifetime",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (productKey: string) => {
    setLoading(productKey);

    try {
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productKey,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "创建支付会话失败");
      }
    } catch (error) {
      console.error("支付失败:", error);
      alert("网络错误，请重试");
    } finally {
      setLoading(null);
    }
  };

  const freeProducts = PRODUCTS.filter((p) => p.category === "free");
  const singleProducts = PRODUCTS.filter((p) => p.category === "single");
  const sprintProducts = PRODUCTS.filter((p) => p.category === "sprint");
  const lifetimeProduct = PRODUCTS.find((p) => p.category === "lifetime");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
        💎 选择适合你的方案
      </h1>
      <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
        基础功能永久免费，按需付费，无订阅压力
      </p>

      {/* 免费试用引导 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-green-800 mb-2">
              🎁 免费试用付费功能
            </h2>
            <p className="text-green-700 mb-4">
              新用户注册即可免费体验：
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-green-700">
                <span className="text-green-500">✓</span> AI模拟面试 1次（价值¥19.9）
              </li>
              <li className="flex items-center gap-2 text-sm text-green-700">
                <span className="text-green-500">✓</span> AI改简历 1次（价值¥9.9）
              </li>
              <li className="flex items-center gap-2 text-sm text-green-700">
                <span className="text-green-500">✓</span> JD智能诊断 3次（价值¥29.7）
              </li>
              <li className="flex items-center gap-2 text-sm text-green-700">
                <span className="text-green-500">✓</span> AI职业竞争力测评（免费）
              </li>
            </ul>
          </div>
          <div className="text-center">
            <a
              href="/quiz"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              🎯 免费测评，领取试用额度
            </a>
            <p className="text-xs text-green-600 mt-2">
              总价值 ¥59.5 · 限时免费
            </p>
          </div>
        </div>
      </div>

      {/* 免费功能 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-green-700">
          ✅ 免费功能（永久免费）
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {freeProducts.map((f, i) => (
            <div
              key={i}
              className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="font-medium text-sm">{f.name}</div>
              <div className="text-xs text-green-600">{f.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 单次付费 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-blue-700">
          🎯 单次付费（即用即走）
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {singleProducts.map((product) => (
            <div
              key={product.key}
              className={`border rounded-xl p-4 text-center relative ${
                product.hot ? "border-blue-500 shadow-md" : ""
              }`}
            >
              {product.hot && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  最热门
                </div>
              )}
              <div className="text-2xl mb-1">{product.icon}</div>
              <div className="font-medium text-sm">{product.name}</div>
              <div className="text-2xl font-bold text-blue-600 my-2">
                ¥{product.priceCNY}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                {product.description}
              </div>
              <button
                onClick={() => handleBuy(product.key)}
                disabled={loading === product.key}
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading === product.key ? "处理中..." : "立即购买"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 冲刺卡 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-purple-700">
          🔥 求职冲刺卡（全功能无限）
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {sprintProducts.map((product) => (
            <div
              key={product.key}
              className={`border rounded-xl p-4 md:p-6 text-center relative ${
                product.recommended ? "border-purple-500 shadow-md" : ""
              }`}
            >
              {product.recommended && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-0.5 rounded-full">
                  推荐
                </div>
              )}
              <div className="font-bold text-lg mb-1">{product.name}</div>
              <div className="text-3xl font-bold text-purple-600">
                ¥{product.priceCNY}
              </div>
              <div className="text-xs text-gray-400 mt-2 mb-3">
                {product.description}
              </div>
              <button
                onClick={() => handleBuy(product.key)}
                disabled={loading === product.key}
                className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading === product.key ? "处理中..." : "立即购买"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 终身会员 */}
      {lifetimeProduct && (
        <div className="mb-10">
          <div className="border-2 border-yellow-400 rounded-xl p-6 md:p-8 bg-gradient-to-r from-yellow-50 to-orange-50 text-center">
            <div className="text-2xl mb-2">{lifetimeProduct.icon}</div>
            <h2 className="text-xl font-bold mb-2">{lifetimeProduct.name}</h2>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              ¥{lifetimeProduct.priceCNY}
            </div>
            <div className="text-sm text-gray-500 mb-1">
              一次付费 · 永久使用 · 所有功能
            </div>
            <div className="text-xs text-red-500 mb-4">
              限前500名 · 原价¥2145.6
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs mb-4">
              {[
                "无限简历诊断",
                "无限AI改简历",
                "无限AI生成简历",
                "无限模拟面试",
                "无限JD匹配",
                "无限求职信",
                "无限职业规划",
                "面试真题库",
                "简历模板库",
              ].map((f, i) => (
                <span
                  key={i}
                  className="bg-white px-2 py-1 rounded-full border"
                >
                  ✓ {f}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleBuy(lifetimeProduct.key)}
              disabled={loading === lifetimeProduct.key}
              className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading === lifetimeProduct.key ? "处理中..." : "立即开通"}
            </button>
          </div>
        </div>
      )}

      {/* 价值对比 */}
      <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-6">
        <h2 className="text-lg font-bold mb-4">💡 为什么选择我们？</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2 text-green-700">✅ 我们的优势</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 免费测评，了解你的AI能力水平</li>
              <li>• 个性化学习路径，针对性提升</li>
              <li>• 项目制学习，产出可展示的作品集</li>
              <li>• 面试问题预测（独家功能）</li>
              <li>• 150+大厂真题，覆盖字节、腾讯、阿里</li>
              <li>• 价格远低于培训机构（¥1-3万）</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-red-700">❌ 其他平台的问题</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 培训机构价格高（¥1-3万）</li>
              <li>• 在线课程与求职脱节</li>
              <li>• 求职平台缺乏学习功能</li>
              <li>• 知识碎片化，不成体系</li>
              <li>• 缺乏实战项目和作品集</li>
              <li>• 无个性化路径推荐</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 支付说明 */}
      <div className="bg-blue-50 rounded-xl p-6 md:p-8 mb-6">
        <h2 className="text-lg font-bold mb-4 text-blue-800">
          💳 支付说明
        </h2>
        <div className="space-y-2 text-sm text-blue-700">
          <p>
            • 支持{" "}
            <strong>Visa、Mastercard、PayPal、Apple Pay、Google Pay</strong>{" "}
            等国际支付方式
          </p>
          <p>
            • <strong>支付宝、微信支付</strong> 即将支持
          </p>
          <p>• 支付由 Creem 安全处理，符合 PCI DSS 标准</p>
          <p>• 支付成功后立即开通权限，无需等待</p>
          <p>• 支持 190+ 国家/地区的税务合规</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-xl p-6 md:p-8">
        <h2 className="text-lg font-bold mb-4">常见问题</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-1">免费版够用吗？</h3>
            <p className="text-gray-600">
              免费版每天可以做3次简历诊断+3次JD匹配+1道模拟面试题+1次职业规划，足够日常使用。如果需要AI直接帮你改简历或完整模拟面试，可以单次付费。
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">单次付费后能用多久？</h3>
            <p className="text-gray-600">
              单次付费的功能永久有效，不限时间。比如购买一次AI改简历，生成的简历你可以永久使用。
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">
              冲刺卡和终身会员有什么区别？
            </h3>
            <p className="text-gray-600">
              冲刺卡是短期无限使用（周/月/季），适合正在找工作的用户。终身会员是一次付费永久使用所有功能，适合长期需要的用户。
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">如何免费试用付费功能？</h3>
            <p className="text-gray-600">
              注册账号后，即可免费体验AI模拟面试1次、AI改简历1次、JD智能诊断3次。总价值¥59.5，限时免费。
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        有问题？联系我们：support@ai-career-tool.com
      </p>
    </div>
  );
}
