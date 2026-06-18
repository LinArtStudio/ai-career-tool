export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">💎 选择适合你的方案</h1>
      <p className="text-gray-600 text-center mb-12">基础功能永久免费，付费解锁AI改简历+JD匹配等高级功能</p>

      <div className="grid md:grid-cols-4 gap-4">
        {/* 免费版 */}
        <div className="border rounded-xl p-5">
          <h3 className="text-lg font-bold mb-1">免费版</h3>
          <div className="text-3xl font-bold mb-3">¥0<span className="text-sm font-normal text-gray-500">/永久</span></div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ 简历诊断 3次/天</li>
            <li>✅ 模拟面试 3题/天</li>
            <li>✅ 职业规划 1次/天</li>
            <li>✅ 基础评分+3条建议</li>
            <li>❌ AI改简历</li>
            <li>❌ JD匹配分析</li>
          </ul>
          <a href="/resume" className="block text-center border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition text-sm">开始使用</a>
        </div>

        {/* 月卡 */}
        <div className="border-2 border-blue-600 rounded-xl p-5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">推荐</div>
          <h3 className="text-lg font-bold mb-1">月卡</h3>
          <div className="text-3xl font-bold mb-3">¥19.9<span className="text-sm font-normal text-gray-500">/月</span></div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ 免费版全部功能</li>
            <li>✅ 无限次使用</li>
            <li>✅ <strong>AI直接改简历</strong></li>
            <li>✅ <strong>JD匹配度分析</strong></li>
            <li>✅ 面试官视角反馈</li>
            <li>❌ 求职进度追踪</li>
          </ul>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm">立即订阅</button>
        </div>

        {/* 季卡 */}
        <div className="border rounded-xl p-5">
          <h3 className="text-lg font-bold mb-1">季卡</h3>
          <div className="text-3xl font-bold mb-3">¥49.9<span className="text-sm font-normal text-gray-500">/季</span></div>
          <div className="text-xs text-green-600 mb-3">省17%</div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ 月卡全部功能</li>
            <li>✅ <strong>求职进度追踪</strong></li>
            <li>✅ <strong>行业求职报告</strong></li>
            <li>✅ AI生成求职信</li>
            <li>✅ 优先响应</li>
          </ul>
          <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition text-sm">立即订阅</button>
        </div>

        {/* 年卡 */}
        <div className="border rounded-xl p-5">
          <h3 className="text-lg font-bold mb-1">年卡</h3>
          <div className="text-3xl font-bold mb-3">¥149<span className="text-sm font-normal text-gray-500">/年</span></div>
          <div className="text-xs text-green-600 mb-3">省38%</div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ 季卡全部功能</li>
            <li>✅ <strong>专属客服</strong></li>
            <li>✅ <strong>新功能优先体验</strong></li>
            <li>✅ 简历模板库</li>
          </ul>
          <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition text-sm">立即订阅</button>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">常见问题</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">免费版够用吗？</h3>
            <p className="text-sm text-gray-600">免费版每天3次诊断+3道面试题，足够日常使用。如果需要AI直接帮你改简历或分析JD匹配度，建议升级月卡。</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">可以退款吗？</h3>
            <p className="text-sm text-gray-600">订阅后7天内不满意可全额退款。</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">支持哪些支付方式？</h3>
            <p className="text-sm text-gray-600">支持微信支付、支付宝。</p>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        有问题？联系我们：support@ai-career-tool.com
      </p>
    </div>
  );
}
