import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/Toast";
import { LoadingProvider } from "@/components/Loading";

export const metadata: Metadata = {
  title: "AI时代求职训练平台 - 面试问题预测·JD智能诊断·简历优化",
  description: "帮助所有求职者掌握AI时代必备技能：面试问题预测、JD智能匹配诊断、150+大厂真题、AI工具使用指导。覆盖AI相关岗位、AI+传统岗位、所有传统岗位。",
  keywords: "AI求职,AI面试,AI工具,ChatGPT,AI转型,产品经理,运营,设计师,AI产品经理,AI工程师,面试题,简历优化,2026年",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: "#2563eb",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "AI时代求职训练平台 - 掌握AI时代必备技能",
    description: "帮助所有求职者掌握AI时代必备技能，覆盖AI相关岗位、AI+传统岗位、所有传统岗位",
    url: "https://ai-career-tool.vercel.app",
    siteName: "AI时代求职训练平台",
    locale: "zh_CN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ErrorBoundary>
          <LoadingProvider>
            <ToastProvider>
            {/* 顶部导航 */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
              <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">AI</div>
                  <span className="text-lg font-bold text-gray-900">AI时代求职</span>
                </a>

                {/* 桌面端导航 */}
                <div className="hidden md:flex items-center gap-1">
                  {[
                    { href: "/quiz", label: "免费测评", icon: "🎯" },
                    { href: "/resume-generator", label: "AI简历生成", icon: "📝" },
                    { href: "/jd-match-v2", label: "JD智能诊断", icon: "🎯" },
                    { href: "/interview", label: "模拟面试", icon: "🎤" },
                    { href: "/dashboard", label: "学习仪表盘", icon: "📊" },
                    { href: "/referral", label: "邀请好友", icon: "🎁" },
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
                        { href: "/quiz", label: "免费测评", icon: "🎯" },
                        { href: "/resume-generator", label: "AI简历生成", icon: "📝" },
                        { href: "/jd-match-v2", label: "JD智能诊断", icon: "🎯" },
                        { href: "/interview", label: "模拟面试", icon: "🎤" },
                        { href: "/interview-bank", label: "面试真题", icon: "📚" },
                        { href: "/dashboard", label: "学习仪表盘", icon: "📊" },
                        { href: "/referral", label: "邀请好友", icon: "🎁" },
                        { href: "/pricing", label: "定价", icon: "💎" },
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
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
