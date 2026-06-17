"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; nickname: string } | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login"
      ? { email, password }
      : { email, password, nickname };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      setUser({ email: data.user?.email || email, nickname: nickname || email.split("@")[0] });
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">👋 你好，{user.nickname}</h1>
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
      <h1 className="text-2xl font-bold text-center mb-8">
        {mode === "login" ? "登录" : "注册"}
      </h1>
      <div className="bg-white border rounded-xl p-6 space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium mb-1">昵称</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
              placeholder="你的昵称" className="w-full border rounded-lg px-4 py-2" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com" className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="至少6位" className="w-full border rounded-lg px-4 py-2" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button onClick={handleAuth} disabled={loading || !email || !password}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
        </button>
        <p className="text-center text-sm text-gray-500">
          {mode === "login" ? "没有账号？" : "已有账号？"}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-blue-600 ml-1 hover:underline">
            {mode === "login" ? "立即注册" : "去登录"}
          </button>
        </p>
      </div>
    </div>
  );
}
