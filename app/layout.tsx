import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI求职工具 - 简历诊断 · 模拟面试 · 职业规划",
  description: "用AI帮你搞定求职全流程：简历优化、模拟面试、职业规划",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: "#2563eb",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <nav className="bg-white/85 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
            <a href="/" className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">🚀 AI求职助手</span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="/resume" className="text-sm text-gray-500 hover:text-emerald-600 transition font-medium">简历诊断</a>
              <a href="/interview" className="text-sm text-gray-500 hover:text-emerald-600 transition font-medium">模拟面试</a>
              <a href="/career" className="text-sm text-gray-500 hover:text-emerald-600 transition font-medium">职业规划</a>
              <a href="/interview-bank" className="text-sm text-gray-500 hover:text-emerald-600 transition font-medium">面试真题</a>
              <a href="/pricing" className="text-sm text-gray-500 hover:text-emerald-600 transition font-medium">定价</a>
              <a href="/dashboard" className="btn-primary px-5 py-2 text-sm">登录</a>
            </div>
            <div className="md:hidden">
              <details className="relative">
                <summary className="cursor-pointer text-gray-500 text-xl list-none p-2">☰</summary>
                <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 w-48 z-50">
                  <a href="/resume" className="block px-4 py-2.5 text-sm hover:bg-gray-50">📄 简历诊断</a>
                  <a href="/resume-builder" className="block px-4 py-2.5 text-sm hover:bg-gray-50">📝 AI生成简历</a>
                  <a href="/interview" className="block px-4 py-2.5 text-sm hover:bg-gray-50">🎤 模拟面试</a>
                  <a href="/interview-bank" className="block px-4 py-2.5 text-sm hover:bg-gray-50">📚 面试真题</a>
                  <a href="/career" className="block px-4 py-2.5 text-sm hover:bg-gray-50">🧭 职业规划</a>
                  <a href="/jd-match" className="block px-4 py-2.5 text-sm hover:bg-gray-50">🎯 JD匹配</a>
                  <a href="/cover-letter" className="block px-4 py-2.5 text-sm hover:bg-gray-50">✉️ 求职信</a>
                  <a href="/pricing" className="block px-4 py-2.5 text-sm hover:bg-gray-50">💎 定价</a>
                  <a href="/dashboard" className="block px-4 py-2.5 text-sm text-emerald-600 font-medium">🔐 登录</a>
                </div>
              </details>
            </div>
          </div>
        </nav>

        {/* Mobile Bottom Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 safe-bottom">
          <div className="grid grid-cols-5 h-14">
            <a href="/" className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-emerald-600 transition">
              <span className="text-base mb-0.5">🏠</span>首页
            </a>
            <a href="/resume" className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-emerald-600 transition">
              <span className="text-base mb-0.5">📄</span>简历
            </a>
            <a href="/interview" className="flex flex-col items-center justify-center text-xs text-emerald-600 font-medium">
              <span className="text-lg mb-0.5">🎤</span>面试
            </a>
            <a href="/career" className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-emerald-600 transition">
              <span className="text-base mb-0.5">🧭</span>规划
            </a>
            <a href="/dashboard" className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-emerald-600 transition">
              <span className="text-base mb-0.5">👤</span>我的
            </a>
          </div>
        </div>
        <ErrorBoundary>
          <ToastProvider>
            <main>{children}</main>
          </ToastProvider>
        </ErrorBoundary>
        <footer className="border-t bg-gray-50 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
            <p>© 2026 AI求职助手 · 用AI让每个人都能找到好工作</p>
            <p className="mt-2">
              <a href="/pricing" className="text-blue-500">定价</a> ·
              <a href="#" className="text-blue-500 ml-2">隐私政策</a> ·
              <a href="#" className="text-blue-500 ml-2">使用条款</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
