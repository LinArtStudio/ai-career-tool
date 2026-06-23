"use client";
import { useState } from "react";

export default function PricingPage() {
  const [showQR, setShowQR] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleBuy = (plan: string) => {
    setSelectedPlan(plan);
    setShowQR(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">💎 选择适合你的方案</h1>
      <p className="text-gray-600 text-center mb-10 text-sm md:text-base">基础功能永久免费，按需付费，无订阅压力</p>

      {/* 赞赏码弹窗 */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center mb-2">💳 购买：{selectedPlan}</h3>
            <div className="bg-gray-100 rounded-xl p-4 mb-4 text-center">
              <div className="text-6xl mb-2">📱</div>
              <p className="text-sm text-gray-600">请使用微信扫码支付</p>
              <p className="text-xs text-gray-400 mt-1">支付完成后截图发送到客服微信</p>
            </div>
            <div className="text-center mb-4">
              <p className="text-sm font-medium">微信赞赏码</p>
              <p className="text-xs text-gray-500">长按识别或截图扫码</p>
            </div>
            <div className="text-xs text-gray-500 space-y-1 mb-4">
              <p>📌 付费流程：</p>
              <p>1. 微信扫码支付</p>
              <p>2. 截图发送到客服微信</p>
              <p>3. 5分钟内开通权限</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowQR(false)} className="flex-1 py-2 border rounded-lg text-sm">取消</button>
              <button onClick={() => { navigator.clipboard.writeText("AI求职工具客服微信：ai-career-tool"); alert("已复制客服微信"); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm">复制客服微信</button>
            </div>
          </div>
        </div>
      )}

      {/* 免费功能 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-green-700">✅ 免费功能（永久免费）</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "AI简历诊断", desc: "每天3次", icon: "📄" },
            { name: "JD匹配分析", desc: "每天3次", icon: "🎯" },
            { name: "面试真题库", desc: "100+真题", icon: "📚" },
            { name: "简历模板", desc: "10套模板", icon: "📋" },
            { name: "AI职业规划", desc: "每天1次", icon: "🧭" },
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
          {[
            { name: "AI改简历", price: "¥9.9", desc: "一键优化简历", icon: "✨", hot: false },
            { name: "AI生成简历", price: "¥19.9", desc: "从零生成完整简历", icon: "📝", hot: false },
            { name: "AI模拟面试", price: "¥19.9", desc: "5题+评分+面试官视角", icon: "🎤", hot: true },
            { name: "AI求职信", price: "¥9.9", desc: "定制求职信", icon: "✉️", hot: false },
          ].map((f, i) => (
            <div key={i} className={`border rounded-xl p-4 text-center relative ${f.hot ? "border-blue-500 shadow-md" : ""}`}>
              {f.hot && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">最热门</div>}
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="font-medium text-sm">{f.name}</div>
              <div className="text-2xl font-bold text-blue-600 my-2">{f.price}</div>
              <div className="text-xs text-gray-500 mb-3">{f.desc}</div>
              <button onClick={() => handleBuy(f.name)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">立即购买</button>
            </div>
          ))}
        </div>
      </div>

      {/* 短期卡 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-purple-700">🔥 求职冲刺卡（全功能无限）</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "周卡", price: "¥19.9", daily: "¥2.8/天", desc: "适合密集面试期", recommended: false },
            { name: "月卡", price: "¥39.9", daily: "¥1.3/天", desc: "覆盖1个月求职", recommended: true },
            { name: "季卡", price: "¥79.9", daily: "¥0.9/天", desc: "覆盖完整求职周期", recommended: false },
          ].map((f, i) => (
            <div key={i} className={`border rounded-xl p-4 md:p-6 text-center relative ${f.recommended ? "border-purple-500 shadow-md" : ""}`}>
              {f.recommended && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-0.5 rounded-full">推荐</div>}
              <div className="font-bold text-lg mb-1">{f.name}</div>
              <div className="text-3xl font-bold text-purple-600">{f.price}</div>
              <div className="text-xs text-gray-500 mt-1">{f.daily}</div>
              <div className="text-xs text-gray-400 mt-2 mb-3">{f.desc}</div>
              <button onClick={() => handleBuy(`冲刺卡-${f.name}`)} className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">立即购买</button>
            </div>
          ))}
        </div>
      </div>

      {/* 终身会员 */}
      <div className="mb-10">
        <div className="border-2 border-gold rounded-xl p-6 md:p-8 bg-gradient-to-r from-yellow-50 to-orange-50 text-center">
          <div className="text-2xl mb-2">👑</div>
          <h2 className="text-xl font-bold mb-2">终身会员</h2>
          <div className="text-4xl font-bold text-orange-600 mb-2">¥128</div>
          <div className="text-sm text-gray-500 mb-1">一次付费 · 永久使用 · 所有功能</div>
          <div className="text-xs text-red-500 mb-4">限前500名 · 原价¥298</div>
          <div className="flex flex-wrap justify-center gap-2 text-xs mb-4">
            {["无限简历诊断", "无限AI改简历", "无限AI生成简历", "无限模拟面试", "无限JD匹配", "无限求职信", "无限职业规划", "面试真题库", "简历模板库"].map((f, i) => (
              <span key={i} className="bg-white px-2 py-1 rounded-full border">✓ {f}</span>
            ))}
          </div>
          <button onClick={() => handleBuy("终身会员")} className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors">立即开通</button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-xl p-6 md:p-8">
        <h2 className="text-lg font-bold mb-4">常见问题</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-1">免费版够用吗？</h3>
            <p className="text-gray-600">免费版每天可以做3次简历诊断+3次JD匹配+1道模拟面试题+1次职业规划，足够日常使用。如果需要AI直接帮你改简历或完整模拟面试，可以单次付费。</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">单次付费后能用多久？</h3>
            <p className="text-gray-600">单次付费的功能永久有效，不限时间。比如购买一次AI改简历，生成的简历你可以永久使用。</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">冲刺卡和终身会员有什么区别？</h3>
            <p className="text-gray-600">冲刺卡是短期无限使用（周/月/季），适合正在找工作的用户。终身会员是一次付费永久使用所有功能，适合长期需要的用户。</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">支持哪些支付方式？</h3>
            <p className="text-gray-600">目前支持微信赞赏码支付。点击购买按钮后会显示赞赏码，扫码支付后截图发送到客服微信，5分钟内开通权限。后续会接入微信支付、支付宝等更多支付方式。</p>
          </div>
        </div>
      </div>

      {/* 付费说明 */}
      <div className="bg-blue-50 rounded-xl p-6 md:p-8 mt-6">
        <h2 className="text-lg font-bold mb-4 text-blue-800">📌 付费说明</h2>
        <div className="space-y-2 text-sm text-blue-700">
          <p>• 点击任意"立即购买"按钮，会显示微信赞赏码</p>
          <p>• 扫码支付后，将支付截图发送到客服微信</p>
          <p>• 客服确认后5分钟内开通对应权限</p>
          <p>• 如有问题，请联系客服微信：ai-career-tool</p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        有问题？联系我们：support@ai-career-tool.com
      </p>
    </div>
  );
}
