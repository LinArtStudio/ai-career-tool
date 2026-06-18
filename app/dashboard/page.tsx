"use client";

import { useState, useEffect } from "react";

type AuthMode = "login" | "register";
type LoginMethod = "phone" | "email";

export default function DashboardPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [method, setMethod] = useState<LoginMethod>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const fetchCaptcha = async () => {
    try {
      const res = await fetch("/api/auth/captcha");
      const data = await res.json();
      setCaptchaQuestion(data.question);
      setCaptchaToken(data.token);
      setCaptchaAnswer("");
    } catch {}
  };

  useEffect(() => { fetchCaptcha(); }, []);

  const sendCode = async () => {
    const target = method === "phone" ? phone : email;
    if (!target) { setError(method === "phone" ? "请输入手机号" : "请输入邮箱"); return; }
    if (method === "phone" && !/^1[3-9]\d{9}$/.test(phone)) { setError("请输入正确的手机号"); return; }
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("请输入正确的邮箱"); return; }
    if (!captchaAnswer) { setError("请完成人机验证"); return; }

    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, method, captchaToken, captchaAnswer }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); fetchCaptcha(); return; }
      setCodeSent(true); setCodeCountdown(60);
      const timer = setInterval(() => {
        setCodeCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
      }, 1000);
    } catch { setError("网络错误"); }
    finally { setLoading(false); }
  };

  const handleAuth = async () => {
    setError(""); setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body: Record<string, string> = { method, password };
      if (method === "phone") body.phone = phone;
      if (method === "email") body.email = email;
      if (codeSent) body.code = code;
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser({ name: data.name || target });
    } catch { setError("网络错误"); }
    finally { setLoading(false); }
  };

  const target = method === "phone" ? phone : email;

  if (user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">你好，{user.name}</h1>
        <div className="grid gap-4">
          <a href="/resume" className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="text-2xl mb-2">简历诊断</div>
            <p className="text-gray-600">上传简历，获得专业评分和优化建议</p>
          </a>
          <a href="/interview" className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="text-2xl mb-2">模拟面试</div>
            <p className="text-gray-600">AI生成面试题，评估你的回答</p>
          </a>
          <a href="/career" className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="text-2xl mb-2">职业规划</div>
            <p className="text-gray-600">探索适合你的职业方向</p>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-8">{mode === "login" ? "登录" : "注册"} AI求职助手</h1>
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <div className="flex border rounded-lg overflow-hidden">
          <button onClick={() => { setMethod("phone"); setError(""); }} className={`flex-1 py-2 text-sm font-medium ${method === "phone" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>手机号</button>
          <button onClick={() => { setMethod("email"); setError(""); }} className={`flex-1 py-2 text-sm font-medium ${method === "email" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>邮箱</button>
        </div>

        {method === "phone" ? (
          <div><label className="block text-sm font-medium mb-1">手机号</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号" maxLength={11} className="w-full border rounded-lg px-4 py-2.5" /></div>
        ) : (
          <div><label className="block text-sm font-medium mb-1">邮箱</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入邮箱" className="w-full border rounded-lg px-4 py-2.5" /></div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">人机验证</label>
          <div className="flex gap-2 items-center">
            <span className="bg-gray-100 px-4 py-2.5 rounded-lg font-mono text-lg font-bold text-blue-700 whitespace-nowrap">{captchaQuestion || "..."}</span>
            <input type="number" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} placeholder="计算结果" className="flex-1 border rounded-lg px-4 py-2.5" />
            <button onClick={fetchCaptcha} className="text-blue-600 text-sm hover:underline whitespace-nowrap">换一题</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">验证码</label>
          <div className="flex gap-2">
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="请输入验证码" maxLength={6} className="flex-1 border rounded-lg px-4 py-2.5" />
            <button onClick={sendCode} disabled={codeCountdown > 0 || loading} className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50 whitespace-nowrap">
              {codeCountdown > 0 ? `${codeCountdown}s` : "获取验证码"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "register" ? "设置密码（至少6位）" : "请输入密码"} className="w-full border rounded-lg px-4 py-2.5" />
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <input type="checkbox" id="agree" className="w-4 h-4" />
          <label htmlFor="agree" className="text-sm text-gray-600">我已阅读并同意《服务协议》和《隐私政策》</label>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">{error}</div>}

        <button onClick={handleAuth} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition text-base">
          {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {mode === "login" ? "没有账号？" : "已有账号？"}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="text-blue-600 ml-1 hover:underline font-medium">
            {mode === "login" ? "立即注册" : "去登录"}
          </button>
        </p>
      </div>
    </div>
  );
}
