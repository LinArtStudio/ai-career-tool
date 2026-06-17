export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          用<span className="text-blue-600">AI</span>帮你搞定求职全流程
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          简历诊断 · 模拟面试 · 职业规划 —— 三大工具，一站式解决你的求职焦虑
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/resume"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            免费诊断简历
          </a>
          <a
            href="/interview"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition"
          >
            开始模拟面试
          </a>
        </div>
      </section>

      {/* 三大功能 */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">三大核心功能</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📄"
            title="AI简历诊断"
            description="上传简历，AI从结构、内容、关键词、成果量化等5个维度专业评分，并给出逐行优化建议。"
            href="/resume"
            cta="免费体验"
          />
          <FeatureCard
            icon="🎤"
            title="AI模拟面试"
            description="输入目标岗位，AI生成针对性面试题，你回答后AI给出专业评估和参考答案。"
            href="/interview"
            cta="开始面试"
          />
          <FeatureCard
            icon="🧭"
            title="AI职业规划"
            description="输入你的专业和兴趣，AI为你生成3条匹配的职业路径，附带学习计划和资源推荐。"
            href="/career"
            cta="探索方向"
          />
        </div>
      </section>

      {/* 数据背书 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">为什么选择我们？</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="5000+" label="简历已诊断" />
            <StatCard number="92%" label="用户满意度" />
            <StatCard number="3秒" label="AI响应速度" />
            <StatCard number="¥0" label="基础版免费" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
        <p className="text-gray-600 mb-8">上传简历，3秒获得专业诊断报告</p>
        <a
          href="/resume"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          立即免费体验 →
        </a>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="border rounded-xl p-6 hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a href={href} className="text-blue-600 font-medium hover:underline">
        {cta} →
      </a>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-blue-600">{number}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
