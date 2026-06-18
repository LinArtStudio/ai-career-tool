export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">隐私政策</h1>
      <p className="text-sm text-gray-500 mb-8">最后更新：2026年6月18日</p>
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-bold mb-3">一、引言</h2>
          <p>欢迎使用AI求职助手。我们非常重视您的隐私保护。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。使用本产品前请仔细阅读。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">二、收集的信息</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>账户信息</strong>：手机号码、邮箱地址，用于注册和验证。</li>
            <li><strong>简历内容</strong>：您上传或粘贴的简历文本，用于AI分析。分析完成后不会永久存储。</li>
            <li><strong>交互数据</strong>：面试回答、职业规划输入，用于提供服务。</li>
            <li><strong>设备信息</strong>：设备型号、浏览器类型、IP地址，用于安全保障。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">三、信息使用</h2>
          <p>您的信息仅用于：提供核心服务、身份验证、个性化推荐、服务优化和法律合规。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">四、AI内容说明</h2>
          <p>本产品使用小米MiMo大模型提供AI服务。AI生成内容仅供参考，不构成专业职业建议。我们不将您的输入数据用于AI模型训练。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">五、信息安全</h2>
          <p>我们采用HTTPS加密传输、访问控制、定期审计等措施保护您的信息。您的简历内容在分析完成后不会永久存储。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">六、您的权利</h2>
          <p>您有权查询、更正、删除个人信息，撤回同意，注销账户。请通过 privacy@ai-career-tool.com 联系我们。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">七、未成年人保护</h2>
          <p>未满18周岁用户需在法定监护人陪同下使用本产品。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">八、政策更新</h2>
          <p>我们可能更新本政策，更新后将在本页面发布。重大变更将通过产品内通知告知。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">九、联系我们</h2>
          <p>邮箱：privacy@ai-career-tool.com</p>
        </section>
      </div>
    </div>
  );
}
