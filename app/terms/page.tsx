export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">服务协议</h1>
      <p className="text-sm text-gray-500 mb-8">最后更新：2026年6月18日</p>
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-bold mb-3">一、服务说明</h2>
          <p>AI求职助手基于AI技术提供简历诊断、模拟面试和职业规划服务。使用本产品即表示您同意本协议。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">二、账户注册</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>提供真实准确的注册信息。</li>
            <li>妥善保管账户密码。</li>
            <li>每个手机号或邮箱只能注册一个账户。</li>
            <li>不得将账户转让给他人。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">三、使用规范</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>不得从事违法违规活动。</li>
            <li>不得利用自动化工具批量调用服务。</li>
            <li>不得对产品进行反向工程。</li>
            <li>不得干扰产品正常运行。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">四、免责声明</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI分析结果仅供参考，不构成专业职业建议。</li>
            <li>不对求职结果或职业发展承担责任。</li>
            <li>您应自行判断AI内容的适用性。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">五、付费服务</h2>
          <p>付费服务的具体内容和价格以产品页面为准。付费完成后除法律另有规定外不支持退款。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">六、知识产权</h2>
          <p>本产品的技术、代码、设计等知识产权归运营方所有。您上传的内容版权归您所有。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">七、协议修改</h2>
          <p>我们有权修改本协议。修改后继续使用即表示您同意修改后的协议。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">八、联系我们</h2>
          <p>邮箱：support@ai-career-tool.com</p>
        </section>
      </div>
    </div>
  );
}
