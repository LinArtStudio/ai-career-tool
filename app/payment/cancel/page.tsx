"use client";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">支付取消</h1>
        <p className="text-gray-500 mb-6">您取消了本次支付，订单未完成</p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="text-sm font-medium text-yellow-800 mb-2">💡 温馨提示</div>
          <p className="text-xs text-yellow-700">
            您可以继续使用免费功能，或随时返回购买付费方案。
            我们提供每天3次免费简历诊断、3次JD匹配、1道模拟面试题。
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="/pricing"
            className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            💎 查看定价方案
          </a>

          <a
            href="/interview"
            className="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
          >
            🎤 免费模拟面试
          </a>

          <a
            href="/resume"
            className="block w-full py-3 border-2 border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors"
          >
            📄 免费简历诊断
          </a>

          <a
            href="/"
            className="block w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            返回首页
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          如有疑问，请联系客服微信：ai-career-tool
        </p>
      </div>
    </div>
  );
}
