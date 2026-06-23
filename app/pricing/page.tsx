"use client";
import { useState } from "react";

// 产品配置
const PRODUCTS = [
  {
    key: "resume_rewrite",
    name: "AI改简历",
    priceUSD: 9.9,
    priceCNY: 71.3,
    description: "一键优化简历，AI专业改写",
    icon: "✨",
    category: "single",
  },
  {
    key: "resume_generate",
    name: "AI生成简历",
    priceUSD: 19.9,
    priceCNY: 143.3,
    description: "从零生成完整专业简历",
    icon: "📝",
    category: "single",
  },
  {
    key: "interview_full",
    name: "AI模拟面试",
    priceUSD: 19.9,
    priceCNY: 143.3,
    description: "5道定制题+评分+面试官视角",
    icon: "🎤",
    category: "single",
    hot: true,
  },
  {
    key: "cover_letter",
    name: "AI求职信",
    priceUSD: 9.9,
    priceCNY: 71.3,
    description: "基于简历+JD定制求职信",
    icon: "✉️",
    category: "single",
  },
  {
    key: "sprint_weekly",
    name: "冲刺卡-周卡",
    priceUSD: 19.9,
    priceCNY: 143.3,
    description: "全功能无限使用7天",
    icon: "🔥",
    category: "sprint",
  },
  {
    key: "sprint_monthly",
    name: "冲刺卡-月卡",
    priceUSD: 39.9,
    priceCNY: 287.3,
    description: "全功能无限使用30天",
    icon: "⚡",
    category: "sprint",
    recommended: true,
  },
  {
    key: "sprint_quarterly",
    name: "冲刺卡-季卡",
    priceUSD: 79.9,
    priceCNY: 575.3,
    description: "全功能无限使用90天",
    icon: "💎",
    category: "sprint",
  },
  {
    key: "lifetime",
    name: "终身会员",
    priceUSD: 128,
    priceCNY: 921.6,
    description: "一次付费，永久使用所有功能",
    icon: "👑",
    category: "lifetime",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"USD" | "CNY">("CNY");

  const handleBuy = async (productKey: string) => {
    setLoading(productKey);

    try {
      // 调用API创建结账会话
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
        // 跳转到Creem支付页面
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

      {/* 货币切换 */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setCurrency("CNY")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currency === "CNY"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🇨🇳 人民币
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currency === "USD"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🇺🇸 美元
          </button>
        </div>
      </div>

      {/* 免费功能 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-green-700">
          ✅ 免费功能（永久免费）
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "AI简历诊断", desc: "每天3次", icon: "📄" },
            { name: "JD匹配分析", desc: "每天3次", icon: "🎯" },
            { name: "面试真题库", desc: "100+真题", icon: "📚" },
            { name: "简历模板", desc: "10套模板", icon: "📋" },
            { name: "AI职业规划", desc: "每天1次", icon: "🧭" },
            { name: "模拟面试预览", desc: "每天1题", icon: "🎤" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="font-medium text-sm">{f.name}</div>
              <div className="text-xs text-green-600">{f.desc}</div>
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
                {currency === "USD"
                  ? `$${product.priceUSD}`
                  : `¥${product.priceCNY}`}
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
                {currency === "USD"
                  ? `$${product.priceUSD}`
                  : `¥${product.priceCNY}`}
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
              {currency === "USD"
                ? `$${lifetimeProduct.priceUSD}`
                : `¥${lifetimeProduct.priceCNY}`}
            </div>
            <div className="text-sm text-gray-500 mb-1">
              一次付费 · 永久使用 · 所有功能
            </div>
            <div className="text-xs text-red-500 mb-4">
              限前500名 · 原价
              {currency === "USD" ? "$298" : "¥2145.6"}
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
            <h3 className="font-medium mb-1">支持哪些支付方式？</h3>
            <p className="text-gray-600">
              支持 Visa、Mastercard、PayPal、Apple Pay、Google
              Pay 等国际支付方式，支付宝和微信支付即将支持。支付由 Creem
              安全处理，符合 PCI DSS 标准。
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">可以退款吗？</h3>
            <p className="text-gray-600">
              如有质量问题，请联系客服微信：ai-career-tool，我们会妥善处理。
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
