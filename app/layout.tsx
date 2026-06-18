import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI求职工具 - 简历诊断 · 模拟面试 · 职业规划",
  description: "用AI帮你搞定求职全流程：简历优化、模拟面试、职业规划",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <nav className="border-b bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              🚀 AI求职助手
            </a>
            <div className="flex items-center gap-6">
              <a href="/resume" className="text-sm text-gray-600 hover:text-blue-600">
                简历诊断
              </a>
              <a href="/jd-match" className="text-sm text-gray-600 hover:text-blue-600">
                JD匹配
              </a>
              <a href="/interview" className="text-sm text-gray-600 hover:text-blue-600">
                模拟面试
              </a>
              <a href="/career" className="text-sm text-gray-600 hover:text-blue-600">
                职业规划
              </a>
              <a href="/pricing" className="text-sm text-gray-600 hover:text-blue-600">
                定价
              </a>
              <a
                href="/dashboard"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                登录
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
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
