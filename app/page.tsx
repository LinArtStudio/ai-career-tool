"use client";

import { useState, useEffect } from 'react';
import { getTrialStatus, getTrialMessage, TrialStatus } from '@/lib/trial';

export default function HomePage() {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);

  useEffect(() => {
    const status = getTrialStatus();
    setTrialStatus(status);
  }, []);

  return (
    <div className="min-h-screen">
      {/* 试用期提示 */}
      {trialStatus && (
        <div className={`px-4 py-2 text-center text-sm ${
          trialStatus.isActive 
            ? 'bg-green-50 text-green-700' 
            : 'bg-yellow-50 text-yellow-700'
        }`}>
          {getTrialMessage()}
          {!trialStatus.isActive && (
            <a href="/pricing" className="ml-2 underline">立即升级</a>
          )}
        </div>
      )}

      {/* Hero Section - 针对所有求职者 */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10">
          {/* 目标用户标签 */}
          <div className="flex justify-center mb-6">
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium">
              🎯 适用于所有岗位求职者
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight">
            <span className="text-gradient">AI时代</span>
            <br />
            求职训练平台
          </h1>
          <p className="text-lg md:text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            掌握AI时代必备技能，提升求职竞争力
            <br />
            <span className="text-gray-500">AI岗位 · AI+传统岗位 · 所有岗位</span>
          </p>

          {/* CTA按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a href="/quiz" className="btn-gradient text-center text-base px-8 py-3.5">
              🎯 免费测评AI职业竞争力
            </a>
            <a href="/jd-match-v2" className="btn-ghost text-center text-base px-8 py-3.5">
              🚀 体验JD智能诊断
            </a>
          </div>

          {/* 核心价值 */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            {[
              "✅ 免费测评（5分钟）",
              "✅ 覆盖所有岗位",
              "✅ 面试问题预测",
              "✅ 150+大厂真题"
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-1">{t}</span>
            ))}
          </div>
        </div>

        {/* 装饰性背景元素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </section>

      {/* 快速开始指南 */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">🚀 3步开启AI求职之旅</h2>
          <p className="text-gray-500 text-center mb-8">新用户？按这个顺序使用效果最佳</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "🎯",
                title: "先做测评",
                desc: "5分钟了解你的AI能力水平，找到提升方向",
                href: "/quiz",
                time: "5分钟",
                free: true
              },
              {
                step: "2",
                icon: "📄",
                title: "优化简历",
                desc: "上传简历，AI帮你诊断问题并给出优化建议",
                href: "/resume",
                time: "3分钟",
                free: true
              },
              {
                step: "3",
                icon: "🎤",
                title: "模拟面试",
                desc: "选择目标岗位，AI模拟真实面试场景",
                href: "/interview",
                time: "10分钟",
                free: false
              }
            ].map((item, i) => (
              <a key={i} href={item.href} className="bg-white rounded-xl p-6 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div className="text-3xl">{item.icon}</div>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">⏱ {item.time}</span>
                  {item.free && <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">✅ 免费</span>}
                </div>
              </a>
            ))}
          </div>
          
          <p className="text-center text-gray-400 text-sm mt-6">
            💡 提示：完成这3步后，你会对自己的求职竞争力有清晰的认识
          </p>
        </div>
      </section>

      {/* 覆盖岗位类型 */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">覆盖所有岗位类型</h2>
        <p className="text-gray-500 text-center mb-12">无论你是什么岗位，AI时代都需要掌握AI技能</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🤖",
              title: "AI相关岗位",
              desc: "AI产品经理、AI工程师、AI训练师、提示词工程师",
              features: ["AI技术深度", "项目实战经验", "面试准备"],
              color: "blue"
            },
            {
              icon: "⚡",
              title: "AI+传统岗位",
              desc: "产品经理+AI、运营+AI、设计师+AI、市场+AI",
              features: ["AI工具使用", "效率提升10倍", "转型路径"],
              color: "purple"
            },
            {
              icon: "📈",
              title: "传统岗位",
              desc: "产品经理、运营、设计师、市场、销售",
              features: ["AI基础认知", "工具入门", "竞争力提升"],
              color: "green"
            }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
              <ul className="space-y-2">
                {item.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* AI职业加速器 - 全流程工具 */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 inline-block">
              核心功能
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI职业加速器</h2>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              从"我不知道该怎么办"到"我拿到offer了"的一站式解决方案
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "🎯",
                title: "诊断规划",
                desc: "AI职业竞争力测评，5分钟了解你的AI能力水平",
                features: ["能力图谱", "个性化路径", "短板分析"],
                href: "/quiz",
                cta: "免费测评"
              },
              {
                step: "2",
                icon: "📚",
                title: "能力培养",
                desc: "项目制学习，边学边做，产出可展示的作品集",
                features: ["AI工具实战", "项目制学习", "作品集生成"],
                href: "/jd-match-v2",
                cta: "开始学习"
              },
              {
                step: "3",
                icon: "🎯",
                title: "求职面试",
                desc: "AI模拟面试、面试问题预测、岗位内推",
                features: ["简历生成", "模拟面试", "岗位内推"],
                href: "/interview",
                cta: "准备面试"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-white/60 text-sm mb-2">步骤 {item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-purple-100 text-sm mb-4">{item.desc}</p>
                <ul className="space-y-2 mb-6">
                  {item.features.map((f, j) => (
                    <li key={j} className="text-purple-100 text-sm flex items-center justify-center gap-2">
                      <span className="text-green-300">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={item.href}
                  className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition"
                >
                  {item.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">6大核心功能</h2>
        <p className="text-gray-500 text-center mb-12">覆盖求职全流程，AI帮你从简历到面试</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { 
              icon: "🎯", 
              title: "JD智能匹配诊断", 
              desc: "多维度匹配评分 + 面试问题预测 + 差距分析", 
              tag: "独家功能", 
              tagType: "hot", 
              href: "/jd-match-v2",
              highlight: true
            },
            { 
              icon: "🎤", 
              title: "AI模拟面试", 
              desc: "150+大厂真题 + AI评估 + 面试官视角反馈", 
              tag: "核心功能", 
              tagType: "hot", 
              href: "/interview" 
            },
            { 
              icon: "📄", 
              title: "简历诊断", 
              desc: "5维度评分 + 逐行优化建议 + ATS优化", 
              tag: "免费", 
              tagType: "free", 
              href: "/resume" 
            },
            { 
              icon: "🧭", 
              title: "职业规划", 
              desc: "3条路径 + 薪资 + 学习路线图", 
              tag: "免费", 
              tagType: "free", 
              href: "/career" 
            },
            { 
              icon: "🎯", 
              title: "AI职业测评", 
              desc: "5分钟了解你的AI能力水平", 
              tag: "免费", 
              tagType: "free", 
              href: "/quiz" 
            },
            { 
              icon: "✉️", 
              title: "AI求职信", 
              desc: "基于简历+JD定制求职信", 
              tag: "¥9.9/次", 
              tagType: "paid", 
              href: "/cover-letter" 
            },
          ].map((f, i) => (
            <a key={i} href={f.href}
              className={`glass-card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer ${
                f.highlight ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}>
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

      {/* 独家功能：面试问题预测 */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 inline-block">
              独家功能
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">面试问题预测</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              基于150+大厂真题，AI预测你可能遇到的面试问题，并提供回答思路
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: "行为面试", icon: "📌", count: "3-5个", desc: "基于STAR法则" },
              { type: "技术面试", icon: "🔧", count: "3-5个", desc: "基于岗位技术要求" },
              { type: "情景面试", icon: "🎭", count: "3-5个", desc: "基于工作场景" },
              { type: "压力面试", icon: "😰", count: "3-5个", desc: "基于候选人差距" }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-1">{item.type}</h3>
                <p className="text-blue-100 text-2xl font-bold mb-2">{item.count}</p>
                <p className="text-blue-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href="/jd-match-v2" className="inline-block bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
              🚀 立即体验面试问题预测
            </a>
          </div>
        </div>
      </section>

      {/* 用户成功案例 */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">用户怎么说</h2>
          <p className="text-gray-500 text-center mb-12">来自不同岗位求职者的真实反馈</p>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { 
                name: "张同学", 
                school: "AI产品经理 · 拿到字节offer", 
                text: "面试问题预测太准了！字节面试官问的3个问题，和预测的一模一样。提前准备好了回答，面试表现很自信。",
                score: "3轮面试全过"
              },
              { 
                name: "李同学", 
                school: "运营+AI · 转型成功", 
                text: "作为传统运营转型，AI工具使用是最大的短板。JD智能诊断帮我精准定位了需要学习的ChatGPT、Midjourney等工具，效率提升10倍。",
                score: "薪资涨幅40%"
              },
              { 
                name: "王同学", 
                school: "设计师 · 拿到腾讯实习", 
                text: "多维度匹配评分让我知道自己和目标岗位的差距在哪里。针对性优化简历后，投了5家拿到3个面试，最终拿到腾讯offer。",
                score: "面试通过率60%"
              }
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
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  ✅ {t.score}
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
            { 
              name: "免费版", 
              price: "¥0", 
              period: "永久", 
              features: [
                "每天3次简历诊断",
                "每天3次JD匹配",
                "每天1道模拟面试",
                "面试真题库",
                "简历模板库"
              ], 
              cta: "立即使用", 
              primary: false, 
              href: "/resume" 
            },
            { 
              name: "单次付费", 
              price: "¥9.9", 
              period: "起/次", 
              features: [
                "AI改简历 ¥9.9/次",
                "AI生成简历 ¥19.9/次",
                "AI模拟面试 ¥19.9/次",
                "AI求职信 ¥9.9/次",
                "即用即走，无绑定"
              ], 
              cta: "按需购买", 
              primary: false, 
              href: "/pricing" 
            },
            { 
              name: "冲刺卡", 
              price: "¥39.9", 
              period: "/月", 
              features: [
                "全功能无限使用",
                "覆盖1个月求职周期",
                "季卡¥79.9更划算",
                "终身会员¥128",
                "限前500名"
              ], 
              cta: "选择方案", 
              primary: true, 
              href: "/pricing" 
            },
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">准备好成为AI时代的人才了吗？</h2>
          <p className="text-blue-100 mb-8">免费开始，掌握AI时代必备技能</p>
          <a href="/quiz" className="inline-block bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
            🚀 免费测评AI职业竞争力
          </a>
        </div>
      </section>

      {/* 底部间距（为移动端Tab栏留空） */}
      <div className="h-20 md:h-0" />
    </div>
  );
}
