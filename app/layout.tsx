import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "AI求职助手 - 简历诊断 · 模拟面试 · 职业规划",
  description: "用AI帮你搞定求职全流程：简历优化、模拟面试、职业规划",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ErrorBoundary>
          <ToastProvider>
            {/* 顶部导航 */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
              <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">AI</div>
                  <span className="text-lg font-bold text-gray-900">求职助手</span>
                </a>

                {/* 桌面端导航 */}
                <div className="hidden md:flex items-center gap-1">
                  {[
                    { href: "/resume", label: "简历诊断", icon: "📄" },
                    { href: "/interview", label: "模拟面试", icon: "🎤" },
                    { href: "/career", label: "职业规划", icon: "🧭" },
                    { href: "/jd-match", label: "JD匹配", icon: "🎯" },
                    { href: "/pricing", label: "定价", icon: "💎" },
                  ].map((item) => (
                    <a key={item.href} href={item.href}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      <span className="mr-1">{item.icon}</span>
                      {item.label}
                    </a>
                  ))}
                  <a href="/dashboard"
                    className="ml-2 btn-gradient text-sm px-4 py-2">
                    登录
                  </a>
                </div>

                {/* 移动端菜单 */}
                <div className="md:hidden">
                  <details className="relative">
                    <summary className="cursor-pointer text-gray-600 text-xl list-none p-2">☰</summary>
                    <div className="absolute right-0 top-12 bg-white border rounded-xl shadow-xl py-2 w-48 z-50">
                      {[
                        { href: "/resume", label: "简历诊断", icon: "📄" },
                        { href: "/resume-builder", label: "AI生成简历", icon: "📝" },
                        { href: "/interview", label: "模拟面试", icon: "🎤" },
                        { href: "/interview-bank", label: "面试真题", icon: "📚" },
                        { href: "/career", label: "职业规划", icon: "🧭" },
                        { href: "/jd-match", label: "JD匹配", icon: "🎯" },
                        { href: "/cover-letter", label: "求职信", icon: "✉️" },
                        { href: "/pricing", label: "定价", icon: "💎" },
                        { href: "/dashboard", label: "登录", icon: "🔐" },
                      ].map((item) => (
                        <a key={item.href} href={item.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50">
                          <span>{item.icon}</span> {item.label}
                        </a>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </nav>

            {/* 主内容 */}
            <main>{children}</main>

            {/* 移动端底部Tab栏 */}
            <div className="md:hidden bottom-tab-bar">
              <div className="flex justify-around items-center max-w-lg mx-auto">
                {[
                  { href: "/", label: "首页", icon: "🏠" },
                  { href: "/resume", label: "简历", icon: "📄" },
                  { href: "/interview", label: "面试", icon: "🎤" },
                  { href: "/career", label: "规划", icon: "🧭" },
                  { href: "/dashboard", label: "我的", icon: "👤" },
                ].map((item) => (
                  <a key={item.href} href={item.href}
                    className="flex flex-col items-center gap-0.5 py-1 px-3 text-gray-500 hover:text-blue-600 transition-colors">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
