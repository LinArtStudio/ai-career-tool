export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">💎 选择适合你的方案</h1>
      <p className="text-gray-600 text-center mb-12">基础功能永久免费，付费解锁无限使用</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 免费版 */}
        <div className="border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-1">免费版</h3>
          <div className="text-3xl font-bold mb-4">¥0<span className="text-sm font-normal text-gray-500">/永久</span></div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ 简历诊断 3次/天</li>
            <li>✅ 模拟面试 3题/天</li>
            <li>✅ 职业规划 1次/天</li>
            <li>❌ 优化建议详情</li>
            <li>❌ 面试参考答案</li>
          </ul>
          <a href="/resume" className="block text-center border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
            开始使用
          </a>
        </div>

        {/* 月卡 */}
        <div className="border-2 border-blue-600 rounded-xl p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
            最受欢迎
          </div>
          <h3 className="text-lg font-bold mb-1">月卡</h3>
          <div className="text-3xl font-bold mb-4">¥29.9<span className="text-sm font-normal text-gray-500">/月</span></div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ 简历诊断 无限次</li>
            <li>✅ 模拟面试 无限次</li>
            <li>✅ 职业规划 无限次</li>
            <li>✅ 详细优化建议</li>
            <li>✅ 面试参考答案</li>
          </ul>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            立即订阅
          </button>
        </div>

        {/* 季卡 */}
        <div className="border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-1">季卡</h3>
          <div className="text-3xl font-bold mb-4">¥69<span className="text-sm font-normal text-gray-500">/季 (省32%)</span></div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ 月卡全部功能</li>
            <li>✅ 优先响应</li>
            <li>✅ 行业定制报告</li>
            <li>✅ 求职进度追踪</li>
          </ul>
          <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">
            立即订阅
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        支付方式：微信支付 · 支付宝 · 小红书薯店<br/>
        有问题？联系我们：support@example.com
      </p>
    </div>
  );
}
