"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - 渐变弥散背景 */}
      <section className="bg-gradient-diffusion relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10">
          {/* 社交证明 */}
          <div className="flex justify-center mb-8">
            <div className="social-proof">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-cyan-500"].map((c, i) => (
                  <div key={i} className={`w-6 h-6 ${c} rounded-full border-2 border-white flex items-center justify-center text-white text-xs`}>
                    {["张", "李", "王", "陈"][i]}
                  </div>
                ))}
              </div>
              <span>已有 <strong className="text-gray-900">12,847</strong> 人使用</span>
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight">
            <span className="text-gradient">AI</span>帮你搞定
            <br />
            求职全流程
          </h1>
          <p className="text-lg md:text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            简历诊断 · AI改简历 · 模拟面试 · JD匹配 · 职业规划
            <br />
            <span className="text-gray-500">一站式AI求职工具，让找工作更高效</span>
          </p>

          {/* CTA按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a href="/resume" className="btn-gradient text-center text-base px-8 py-3.5">
              🚀 免费开始使用
            </a>
            <a href="/pricing" className="btn-ghost text-center text-base px-8 py-3.5">
              查看定价方案
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            {["✅ 基础功能永久免费", "🔒 数据安全加密", "⚡ AI秒级响应"].map((t, i) => (
              <span key={i} className="flex items-center gap-1">{t}</span>
            ))}
          </div>
        </div>

        {/* 装饰性背景元素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </section>

      {/* 核心功能 */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">6大核心功能</h2>
        <p className="text-gray-500 text-center mb-12">覆盖求职全流程，AI帮你从简历到面试</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: "📄", title: "AI简历诊断", desc: "5维度评分 + 逐行优化建议", tag: "免费", tagType: "free", href: "/resume" },
            { icon: "✨", title: "AI改简历", desc: "一键输出优化后完整简历", tag: "¥9.9/次", tagType: "paid", href: "/resume" },
            { icon: "🎤", title: "AI模拟面试", desc: "5道定制题 + 面试官视角反馈", tag: "最热门", tagType: "hot", href: "/interview" },
            { icon: "🎯", title: "JD匹配分析", desc: "匹配度百分比 + 关键词差距", tag: "免费", tagType: "free", href: "/jd-match" },
            { icon: "🧭", title: "AI职业规划", desc: "3条路径 + 薪资 + 学习路线图", tag: "免费", tagType: "free", href: "/career" },
            { icon: "✉️", title: "AI求职信", desc: "基于简历+JD定制求职信", tag: "¥9.9/次", tagType: "paid", href: "/cover-letter" },
          ].map((f, i) => (
            <a key={i} href={f.href}
              className="glass-card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{f.icon}</div>
                <span className={`feature-tag feature-tag-${f.tagType}`}>{f.tag}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* 用户评价 */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">用户怎么说</h2>
          <p className="text-gray-500 text-center mb-12">来自真实用户的反馈</p>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "张同学", school: "北京大学", text: "AI诊断帮我发现了简历里20个问题，改完后投了5家拿到3个面试！", score: 55, newScore: 85 },
              { name: "李同学", school: "浙江大学", text: "模拟面试的面试官视角太真实了，直接告诉我'不会录用'，扎心但有用。", score: 30, newScore: 72 },
              { name: "王同学", school: "复旦大学", text: "JD匹配分析太实用了，知道缺什么关键词再改简历，命中率翻倍。", score: 60, newScore: 90 },
            ].map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.school}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">优化前</span>
                  <span className="text-sm font-bold text-red-500">{t.score}分</span>
                  <span className="text-xs text-gray-400">→</span>
                  <span className="text-xs text-gray-400">优化后</span>
                  <span className="text-sm font-bold text-green-600">{t.newScore}分</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 定价预览 */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">灵活定价</h2>
        <p className="text-gray-500 text-center mb-12">按需付费，无订阅压力</p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: "免费版", price: "¥0", period: "永久", features: ["每天3次简历诊断", "每天3次JD匹配", "每天1道模拟面试", "面试真题库", "简历模板库"], cta: "立即使用", primary: false, href: "/resume" },
            { name: "单次付费", price: "¥9.9", period: "起/次", features: ["AI改简历 ¥9.9/次", "AI生成简历 ¥19.9/次", "AI模拟面试 ¥19.9/次", "AI求职信 ¥9.9/次", "即用即走，无绑定"], cta: "按需购买", primary: false, href: "/pricing" },
            { name: "冲刺卡", price: "¥39.9", period: "/月", features: ["全功能无限使用", "覆盖1个月求职周期", "季卡¥79.9更划算", "终身会员¥128", "限前500名"], cta: "选择方案", primary: true, href: "/pricing" },
          ].map((p, i) => (
            <div key={i} className={`rounded-2xl p-6 md:p-8 ${p.primary ? "bg-gradient-primary text-white shadow-xl" : "glass-card"}`}>
              <h3 className="text-lg font-bold mb-2">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="price-tag text-4xl">{p.price}</span>
                <span className={`text-sm ${p.primary ? "text-blue-100" : "text-gray-500"}`}>{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2 text-sm ${p.primary ? "text-blue-50" : "text-gray-600"}`}>
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href={p.href}
                className={`block text-center py-3 rounded-xl font-medium transition-all ${
                  p.primary
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "btn-gradient w-full"
                }`}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 底部CTA */}
      <section className="bg-gradient-primary py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">准备好优化你的求职之路了吗？</h2>
          <p className="text-blue-100 mb-8">免费开始，AI帮你从简历到面试全程搞定</p>
          <a href="/resume" className="inline-block bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
            🚀 免费开始使用
          </a>
        </div>
      </section>

      {/* 底部间距（为移动端Tab栏留空） */}
      <div className="h-20 md:h-0" />
    </div>
  );
}
