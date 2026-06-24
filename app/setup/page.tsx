"use client";
import { useState, useEffect } from "react";

interface ConfigStatus {
  success: boolean;
  message: string;
  details: Record<string, any>;
}

export default function SetupPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/check-supabase");
      const data = await response.json();
      setConfigStatus(data);
    } catch (error) {
      console.error("检查配置失败:", error);
      setConfigStatus({
        success: false,
        message: "检查配置失败",
        details: { error: "网络错误" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">⚙️ 系统配置</h1>
          <p className="text-gray-500">检查和配置系统所需的各项服务</p>
        </div>

        {/* Supabase配置 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">🗄️</div>
            <div>
              <h2 className="text-xl font-bold">Supabase数据库</h2>
              <p className="text-gray-500 text-sm">用户数据持久化存储</p>
            </div>
            <div className="ml-auto">
              {loading ? (
                <span className="animate-spin text-2xl">⏳</span>
              ) : configStatus?.success ? (
                <span className="text-2xl">✅</span>
              ) : (
                <span className="text-2xl">❌</span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">正在检查配置...</p>
            </div>
          ) : configStatus?.success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-800 mb-2">✅ 配置正确</h3>
              <p className="text-green-700 text-sm">Supabase数据库已正确配置，可以正常使用。</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800 mb-2">⚠️ 需要配置</h3>
                <p className="text-yellow-700 text-sm mb-4">{configStatus?.message}</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <div>
                      <h4 className="font-medium">注册Supabase账号</h4>
                      <p className="text-sm text-gray-600">
                        访问{" "}
                        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          supabase.com
                        </a>
                        ，使用GitHub账号登录
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <div>
                      <h4 className="font-medium">创建项目</h4>
                      <p className="text-sm text-gray-600">
                        项目名: <code className="bg-gray-100 px-1 rounded">ai-career-tool</code>
                        <br />
                        区域: <code className="bg-gray-100 px-1 rounded">Northeast Asia (Tokyo)</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <div>
                      <h4 className="font-medium">执行数据库Schema</h4>
                      <p className="text-sm text-gray-600">
                        进入 SQL Editor，执行{" "}
                        <code className="bg-gray-100 px-1 rounded">supabase/schema.sql</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <div>
                      <h4 className="font-medium">配置环境变量</h4>
                      <p className="text-sm text-gray-600">
                        在Vercel和阿里云服务器添加：
                      </p>
                      <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg text-center font-medium hover:bg-green-700 transition"
                >
                  打开Supabase官网
                </a>
                <button
                  onClick={checkConfig}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  重新检查
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 其他配置 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔧 其他配置</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <h3 className="font-medium">Creem支付</h3>
                  <p className="text-sm text-gray-500">专业支付平台</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">待配置</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-medium">Sentry监控</h3>
                  <p className="text-sm text-gray-500">错误监控</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">待配置</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-medium">小米MiMo API</h3>
                  <p className="text-sm text-gray-500">AI模型服务</p>
                </div>
              </div>
              <span className="text-sm text-green-600">已配置</span>
            </div>
          </div>
        </div>

        {/* 快速入口 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/quiz"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-sm">免费测评</div>
          </a>
          <a
            href="/jd-match-v2"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-sm">JD诊断</div>
          </a>
          <a
            href="/interview"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🎤</div>
            <div className="font-medium text-sm">模拟面试</div>
          </a>
          <a
            href="/dashboard"
            className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-sm">学习仪表盘</div>
          </a>
        </div>
      </div>
    </div>
  );
}
