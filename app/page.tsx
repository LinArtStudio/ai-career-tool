"use client";
import { useState } from "react";

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { icon: "📄", title: "AI简历诊断", desc: "5维度评分+逐行优化建议+AI一键改简历", free: "每天3次免费", href: "/resume" },
    { icon: "🎤", title: "AI模拟面试", desc: "真实公司面试题+评分+面试官视角", free: "每天1题免费", href: "/interview" },
    { icon: "🧭", title: "AI职业规划", desc: "3条职业路径+薪资+学习路线图", free: "每天1次免费", href: "/career" },
    { icon: "🎯", title: "JD匹配分析", desc: "简历与岗位匹配度+关键词差距", free: "每天3次免费", href: "/jd-match" },
    { icon: "📝", title: "AI生成简历", desc: "输入信息→AI生成专业中文简历", free: "", href: "/resume-builder" },
    { icon: "✉️", title: "AI求职信", desc: "基于简历+JD定制求职信", free: "", href: "/cover-letter" },
    { icon: "📚", title: "面试真题库", desc: "100+道大厂真实面试题", free: "全部免费", href: "/interview-bank" },
  ];

  const stats = [
    { number: "100+", label: "大厂面试真题" },
    { number: "500+", label: "覆盖岗位" },
    { number: "300+", label: "覆盖公司" },
    { number: "96%", label: "用户满意度" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-orange-50" />
        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-full px-4 py-1.5 mb-6 text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-gray-600">AI驱动 · 全流程求职工具</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">AI帮你</span>搞定求职全流程
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            简历诊断 → AI改简历 → 模拟面试 → JD匹配 → 职业规划<br className="hidden md:block" />
            <span className="text-gray-400">一个工具，覆盖从写简历到拿offer的每一步</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a href="/resume" className="btn-primary px-8 py-3.5 text-base">🚀 免费开始诊断简历</a>
            <a href="/interview" className="btn-ghost px-8 py-3.5 text-base bg-white">🎤 体验AI模拟面试</a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="card-glass px-4 py-3">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600">{s.number}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">7大AI功能，覆盖求职全链路</h2>
          <p className="text-gray-500">基础功能永久免费，按需付费，无订阅压力</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <a key={i} href={f.href}
              className="card p-5 group cursor-pointer"
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}>
              <div className="text-3xl mb-3 transition-transform duration-200 group-hover:scale-110">{f.icon}</div>
              <h3 className="font-bold text-base mb-1.5">{f.title}</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{f.desc}</p>
              {f.free && <span className="tag text-xs">{f.free}</span>}
              {hoveredFeature === i && (
                <div className="mt-3 text-xs text-emerald-600 font-medium">点击体验 →</div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 tracking-tight">3步搞定求职</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "上传简历", desc: "粘贴或上传你的简历，AI自动分析", icon: "📤" },
              { step: "02", title: "AI诊断优化", desc: "5维度评分+逐行建议+一键优化", icon: "🤖" },
              { step: "03", title: "模拟面试", desc: "真实公司面试题+评分+面试官视角", icon: "🎯" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-3xl mb-4">{s.icon}</div>
                <div className="text-xs text-emerald-600 font-bold mb-1">STEP {s.step}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 tracking-tight">用户怎么说</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "小王", role: "2026届应届生", content: "AI诊断直接指出我简历的3个致命问题，改完后投5家拿到3个面试！", score: "拿到腾讯offer" },
            { name: "李同学", role: "转行求职者", content: "模拟面试的面试官视角太真实了，直接告诉我'不会录用'，让我知道差距在哪。", score: "薪资涨幅40%" },
            { name: "张同学", role: "考研二战选手", content: "职业规划功能帮我理清了方向，不再迷茫。JD匹配分析让我精准投递。", score: "2周内入职" },
          ].map((t, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">{t.name[0]}</div>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">"{t.content}"</p>
              <div className="tag text-xs">{t.score}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-20 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">还在等什么？</h2>
          <p className="text-emerald-100 mb-8">每天免费诊断3次简历，开始你的求职升级</p>
          <a href="/resume" className="inline-flex items-center justify-center bg-white text-emerald-700 font-bold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition shadow-lg">🚀 立即开始</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-3">产品功能</h4>
              <div className="space-y-2 text-sm">
                <a href="/resume" className="block hover:text-white transition">简历诊断</a>
                <a href="/interview" className="block hover:text-white transition">模拟面试</a>
                <a href="/career" className="block hover:text-white transition">职业规划</a>
                <a href="/jd-match" className="block hover:text-white transition">JD匹配</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">AI工具</h4>
              <div className="space-y-2 text-sm">
                <a href="/resume-builder" className="block hover:text-white transition">AI生成简历</a>
                <a href="/cover-letter" className="block hover:text-white transition">AI求职信</a>
                <a href="/interview-bank" className="block hover:text-white transition">面试真题库</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">账户</h4>
              <div className="space-y-2 text-sm">
                <a href="/dashboard" className="block hover:text-white transition">登录/注册</a>
                <a href="/pricing" className="block hover:text-white transition">定价方案</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">法律</h4>
              <div className="space-y-2 text-sm">
                <a href="/privacy" className="block hover:text-white transition">隐私政策</a>
                <a href="/terms" className="block hover:text-white transition">服务协议</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>© 2026 AI求职助手 · 用AI让每个人都能找到好工作</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
