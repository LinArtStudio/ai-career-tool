"use client";
import { useState } from "react";

// 产品配置
const PRODUCTS = [
  {
    key: "resume_rewrite",
    name: "AI改简历",
    priceCNY: 9.9,
    description: "一键优化简历，AI专业改写",
    icon: "✨",
    category: "single",
  },
  {
    key: "interview_full",
    name: "AI模拟面试",
    priceCNY: 19.9,
    description: "5道定制题+评分+面试官视角",
    icon: "🎤",
    category: "single",
    hot: true,
  },
  {
    key: "jd_match_full",
    name: "JD智能诊断",
    priceCNY: 9.9,
    description: "多维度匹配+差距分析+面试预测",
    icon: "🎯",
    category: "single",
  },
  {
    key: "cover_letter",
    name: "AI求职信",
    priceCNY: 9.9,
    description: "基于简历+JD定制求职信",
    icon: "✉️",
    category: "single",
  },
  {
    key: "sprint_weekly",
    name: "冲刺卡-周卡",
    priceCNY: 19.9,
    description: "全功能无限使用7天",
    icon: "🔥",
    category: "sprint",
  },
  {
    key: "sprint_monthly",
    name: "冲刺卡-月卡",
    priceCNY: 39.9,
    description: "全功能无限使用30天",
    icon: "⚡",
    category: "sprint",
    recommended: true,
  },
  {
    key: "sprint_quarterly",
    name: "冲刺卡-季卡",
    priceCNY: 99.9,
    description: "全功能无限使用90天",
    icon: "💎",
    category: "sprint",
  },
  {
    key: "lifetime",
    name: "终身会员",
    priceCNY: 199,
    description: "一次付费，永久使用所有功能",
    icon: "👑",
    category: "lifetime",
  },
];

export default function PricingPage() {
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"wechat" | "alipay">("wechat");

  const handleBuy = (product: any) => {
    setSelectedProduct(product);
    setShowPayModal(true);
  };

  const singleProducts = PRODUCTS.filter((p) => p.category === "single");
  const sprintProducts = PRODUCTS.filter((p) => p.category === "sprint");
  const lifetimeProduct = PRODUCTS.find((p) => p.category === "lifetime");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
        💎 选择适合你的方案
      </h1>
      <p className="text-gray-600 text-center mb-10 text-sm md:text-base">
        基础功能永久免费，按需付费，无订阅压力
      </p>

      {/* 免费功能 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-green-700">✅ 免费功能（永久免费）</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "AI职业测评", desc: "每天3次", icon: "🎯" },
            { name: "简历诊断", desc: "每天3次", icon: "📄" },
            { name: "JD匹配分析", desc: "每天3次", icon: "🎯" },
            { name: "模拟面试预览", desc: "每天1题", icon: "🎤" },
          ].map((f, i) => (
            <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="font-medium text-sm">{f.name}</div>
              <div className="text-xs text-green-600">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 单次付费 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-blue-700">🎯 单次付费（即用即走）</h2>
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
              <div className="text-xs text-gray-500 mb-3">{product.description}</div>
              <button
                onClick={() => handleBuy(product)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                立即购买
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 冲刺卡 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-purple-700">🔥 求职冲刺卡（全功能无限）</h2>
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
              <div className="text-xs text-gray-400 mt-2 mb-3">{product.description}</div>
              <button
                onClick={() => handleBuy(product)}
                className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                立即购买
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
              限前500名 · 原价¥399
            </div>
            <button
              onClick={() => handleBuy(lifetimeProduct)}
              className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors"
            >
              立即开通
            </button>
          </div>
        </div>
      )}

      {/* 支付说明 */}
      <div className="bg-blue-50 rounded-xl p-6 md:p-8 mb-6">
        <h2 className="text-lg font-bold mb-4 text-blue-800">💳 支付说明</h2>
        <div className="space-y-3 text-sm text-blue-700">
          <p><strong>支付方式</strong>：微信扫码支付 / 支付宝扫码支付</p>
          <p><strong>支付流程</strong>：</p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>点击"立即购买"按钮</li>
            <li>选择支付方式（微信/支付宝）</li>
            <li>保存支付二维码图片</li>
            <li>打开微信/支付宝扫码支付</li>
            <li>截图支付凭证发送给客服</li>
            <li>5分钟内开通权限</li>
          </ol>
          <p><strong>客服微信</strong>：ai-career-tool</p>
          <p><strong>客服邮箱</strong>：support@ai-career-tool.com</p>
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPayModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPayModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center mb-4">💳 扫码支付</h3>
            
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-2">您选择了：<strong>{selectedProduct.name}</strong></p>
              <p className="text-2xl font-bold text-blue-600">¥{selectedProduct.priceCNY}</p>
            </div>

            {/* 支付方式切换 */}
            <div className="flex border rounded-lg overflow-hidden mb-4">
              <button
                onClick={() => setPaymentMethod("wechat")}
                className={`flex-1 py-2 text-sm font-medium ${paymentMethod === "wechat" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-600"}`}
              >
                💬 微信支付
              </button>
              <button
                onClick={() => setPaymentMethod("alipay")}
                className={`flex-1 py-2 text-sm font-medium ${paymentMethod === "alipay" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}
              >
                💳 支付宝
              </button>
            </div>

            {/* 支付二维码 */}
            <div className="bg-gray-100 rounded-xl p-4 text-center mb-4">
              {paymentMethod === "wechat" ? (
                <div>
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-sm text-gray-600 mb-2">微信扫码支付</p>
                  <p className="text-xs text-gray-400">请使用微信扫一扫</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">💳</div>
                  <p className="text-sm text-gray-600 mb-2">支付宝扫码支付</p>
                  <p className="text-xs text-gray-400">请使用支付宝扫一扫</p>
                </div>
              )}
            </div>

            {/* 支付步骤 */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-blue-800 mb-2">📌 支付步骤</h4>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. 截图此页面（包含产品信息和二维码）</li>
                <li>2. 打开{paymentMethod === "wechat" ? "微信" : "支付宝"}，扫描二维码支付</li>
                <li>3. 支付完成后，截图支付凭证</li>
                <li>4. 发送给客服微信：ai-career-tool</li>
                <li>5. 5分钟内开通权限</li>
              </ol>
            </div>

            {/* 按钮 */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowPayModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("客服微信：ai-career-tool");
                  alert("已复制客服微信");
                }}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                复制客服微信
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mt-8">
        有问题？联系我们：support@ai-career-tool.com
      </p>
    </div>
  );
}
