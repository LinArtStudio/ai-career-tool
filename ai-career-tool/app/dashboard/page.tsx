"use client";

import { useState, useEffect } from "react";

type AuthMode = "login" | "register";
type LoginMethod = "phone" | "email";

function MathCaptcha({ onVerify }: { onVerify: (token: string) => void }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("+");
  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => { generate(); }, []);

  const generate = () => {
    const newA = Math.floor(Math.random() * 20) + 1;
    const newB = Math.floor(Math.random() * 20) + 1;
    const ops = ["+", "-", "×"];
    setA(newA); setB(newB);
    setOp(ops[Math.floor(Math.random() * ops.length)]);
    setAnswer(""); setVerified(false);
  };

  const check = () => {
    let correct = 0;
    if (op === "+") correct = a + b;
    else if (op === "-") correct = a - b;
    else correct = a * b;
    if (parseInt(answer) === correct) {
      setVerified(true);
      onVerify(`${a}${op}${b}=${correct}`);
    } else { generate(); }
  };

  if (verified) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
        <span className="text-green-600">✅</span>
        <span className="text-sm text-green-700">验证通过</span>
        <button onClick={generate} className="text-xs text-gray-400 ml-auto">刷新</button>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-600 mb-2">🤖 请完成人机验证</div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-mono font-bold">{a} {op} {b} = ?</span>
        <input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)}
          className="w-20 border rounded px-2 py-1 text-center" placeholder="?" />
        <button onClick={check} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">验证</button>
        <button onClick={generate} className="text-gray-400 text-sm">↻</button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [method, setMethod] = useState<LoginMethod>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  const sendCode = async () => {
    if (!captchaToken) { setError("请先完成人机验证"); return; }
    const target = method === "phone" ? phone : email;
    if (!target) { setError(method === "phone" ? "请输入手机号" : "请输入邮箱"); return; }
    if (method === "phone" && !/^1[3-9]\d{9}$/.test(phone)) { setError("请输入正确的手机号"); return; }
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("请输入正确的邮箱"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, method, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "发送失败"); return; }
      setCodeSent(true);
      if (data.dev_code) setDevCode(data.dev_code);
      setCodeCountdown(60);
      const timer = setInterval(() => {
        setCodeCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
      }, 1000);
    } catch { setError("网络错误"); } finally { setLoading(false); }
  };

  const handleAuth = async () => {
    if (!captchaToken) { setError("请先完成人机验证"); return; }
    setError(""); setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body: Record<string, string> = { method, password, captchaToken };
      if (method === "phone") body.phone = phone;
      if (method === "email") body.email = email;
      if (codeSent) body.code = code;
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "操作失败"); return; }
      setUser({ name: data.name || (method === "phone" ? phone : email) });
    } catch { setError("网络错误"); } finally { setLoading(false); }
  };

  if (user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">👋 你好，{user.name}</h1>
        <div className="grid gap-4">
          <a href="/resume" className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="text-2xl mb-2">📄 简历诊断</div>
            <p className="text-gray-600">上传简历，获得专业评分和优化建议</p>
          </a>
          <a href="/interview" className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="text-2xl mb-2">🎤 模拟面试</div>
            <p className="text-gray-600">AI生成面试题，评估你的回答</p>
          </a>
          <a href="/career" className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="text-2xl mb-2">🧭 职业规划</div>
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
          <button onClick={() => setMethod("phone")} className={`flex-1 py-2 text-sm font-medium transition ${method === "phone" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>📱 手机号</button>
          <button onClick={() => setMethod("email")} className={`flex-1 py-2 text-sm font-medium transition ${method === "email" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600"}`}>📧 邮箱</button>
        </div>

        {method === "phone" ? (
          <div><label className="block text-sm font-medium mb-1">手机号</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号" maxLength={11} className="w-full border rounded-lg px-4 py-2.5 text-base" /></div>
        ) : (
          <div><label className="block text-sm font-medium mb-1">邮箱</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入邮箱" className="w-full border rounded-lg px-4 py-2.5 text-base" /></div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">验证码</label>
          <div className="flex gap-2">
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="请输入验证码" maxLength={6} className="flex-1 border rounded-lg px-4 py-2.5 text-base" />
            <button onClick={sendCode} disabled={codeCountdown > 0 || loading || !captchaToken} className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition">
              {codeCountdown > 0 ? `${codeCountdown}s` : "获取验证码"}
            </button>
          </div>
          {devCode && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
              📋 验证码：<span className="font-mono font-bold text-lg">{devCode}</span>
              <span className="text-gray-500 text-xs ml-2">（开发模式显示）</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "register" ? "设置密码（至少6位）" : "请输入密码"} className="w-full border rounded-lg px-4 py-2.5 text-base" />
        </div>

        <MathCaptcha onVerify={setCaptchaToken} />

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">{error}</div>}

        <button onClick={handleAuth} disabled={loading || !captchaToken} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition text-base">
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
