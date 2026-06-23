"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // 获取订单信息
    const checkoutId = searchParams.get("checkout_id");
    const productId = searchParams.get("product_id");

    if (checkoutId) {
      setOrderInfo({
        checkoutId,
        productId,
        status: "success",
      });
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">支付成功！</h1>
        <p className="text-gray-500 mb-6">感谢您的购买，权限已开通</p>

        {orderInfo && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="text-sm text-gray-500 mb-2">订单信息</div>
            <div className="text-xs text-gray-400 font-mono">{orderInfo.checkoutId}</div>
          </div>
        )}

        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-sm font-medium text-green-800 mb-2">🎉 权益已开通</div>
            <ul className="text-xs text-green-700 space-y-1 text-left">
              <li>✅ 无限次简历诊断</li>
              <li>✅ 无限次AI模拟面试</li>
              <li>✅ 无限次JD匹配分析</li>
              <li>✅ 无限次职业规划</li>
              <li>✅ 面试真题库完整版</li>
            </ul>
          </div>

          <a
            href="/interview"
            className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            🎤 开始模拟面试
          </a>

          <a
            href="/resume"
            className="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
          >
            📄 简历诊断
          </a>

          <a
            href="/"
            className="block w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            返回首页
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          如有问题，请联系客服微信：ai-career-tool
        </p>
      </div>
    </div>
  );
}
