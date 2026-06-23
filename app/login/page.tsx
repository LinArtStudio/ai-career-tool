"use client";
import { useState } from "react";
import { sendEmailCode, verifyEmailCode, sendPhoneCode, verifyPhoneCode } from "@/lib/auth";

export default function LoginPage() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendCode = async () => {
    if (!contact) return;
    setLoading(true);
    setError("");

    try {
      let result;
      if (method === "email") {
        result = await sendEmailCode(contact);
      } else {
        result = await sendPhoneCode(contact);
      }

      if (result.success) {
        setStep("verify");
        setSuccess("验证码已发送");
      } else {
        setError(result.error || "发送失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code) return;
    setLoading(true);
    setError("");

    try {
      let result;
      if (method === "email") {
        result = await verifyEmailCode(contact, code);
      } else {
        result = await verifyPhoneCode(contact, code);
      }

      if (result.success) {
        setSuccess("登录成功！");
        // 跳转到首页
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setError(result.error || "验证失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold mb-2">登录 / 注册</h1>
          <p className="text-gray-500 text-sm">登录后可同步数据到云端，多设备使用</p>
        </div>

        {/* 登录方式切换 */}
        <div className="flex border rounded-lg overflow-hidden mb-6">
          <button
            onClick={() => { setMethod("email"); setStep("input"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-sm font-medium ${method === "email" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}
          >
            📧 邮箱登录
          </button>
          <button
            onClick={() => { setMethod("phone"); setStep("input"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 text-sm font-medium ${method === "phone" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}
          >
            📱 手机登录
          </button>
        </div>

        {/* 错误/成功提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            {success}
          </div>
        )}

        {step === "input" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {method === "email" ? "邮箱地址" : "手机号码"}
              </label>
              <input
                type={method === "email" ? "email" : "tel"}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={method === "email" ? "请输入邮箱" : "请输入手机号"}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSendCode}
              disabled={!contact || loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "发送中..." : "发送验证码"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入6位验证码"
                maxLength={6}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={!code || loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "验证中..." : "登录"}
            </button>
            <button
              onClick={() => { setStep("input"); setError(""); setSuccess(""); }}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              返回修改{method === "email" ? "邮箱" : "手机号"}
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-gray-400">
            登录即表示同意我们的{" "}
            <a href="/terms" className="text-blue-500 hover:underline">服务条款</a>
            {" "}和{" "}
            <a href="/privacy" className="text-blue-500 hover:underline">隐私政策</a>
          </p>
        </div>
      </div>
    </div>
  );
}
