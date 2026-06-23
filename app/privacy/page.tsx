"use client";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">隐私政策</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>最后更新日期</strong>：2026年6月24日
        </p>

        <p className="text-gray-600 mb-6">
          欢迎使用AI求职工具（以下简称"我们"或"本平台"）。我们非常重视您的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">一、我们收集的信息</h2>
        
        <h3 className="text-xl font-bold mt-6 mb-3">1.1 您主动提供的信息</h3>
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li><strong>简历内容</strong>：您在使用简历诊断、AI改简历等功能时上传的简历文本</li>
          <li><strong>岗位描述(JD)</strong>：您在使用JD匹配分析功能时粘贴的岗位描述</li>
          <li><strong>面试回答</strong>：您在使用模拟面试功能时输入的回答内容</li>
          <li><strong>个人信息</strong>：您在注册时提供的邮箱、手机号等联系方式</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">1.2 自动收集的信息</h3>
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li><strong>使用数据</strong>：您使用各功能的次数、时间、频率</li>
          <li><strong>设备信息</strong>：浏览器类型、操作系统、设备型号</li>
          <li><strong>网络信息</strong>：IP地址、访问时间、页面浏览记录</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">二、我们如何使用您的信息</h2>
        
        <p className="text-gray-600 mb-4">我们使用您的信息用于以下目的：</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li><strong>提供服务</strong>：处理您的简历、生成面试问题、提供AI分析结果</li>
          <li><strong>改进产品</strong>：分析使用数据，优化AI模型和用户体验</li>
          <li><strong>个性化推荐</strong>：根据您的使用历史，推荐相关功能和内容</li>
          <li><strong>安全防护</strong>：防止滥用、欺诈和安全威胁</li>
          <li><strong>法律合规</strong>：遵守相关法律法规的要求</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">三、AI模型数据处理</h2>
        
        <p className="text-gray-600 mb-4">
          <strong>重要说明</strong>：当您使用我们的AI功能时，您输入的内容（如简历、JD、面试回答）会被发送到第三方AI服务提供商（小米MiMo API）进行处理。
        </p>
        
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li>我们使用的AI服务提供商已承诺不将您的数据用于训练其模型</li>
          <li>您的数据在传输过程中使用SSL加密</li>
          <li>我们不会将您的原始数据永久存储在AI服务提供商处</li>
          <li>AI生成的结果会存储在我们的服务器上，用于为您提供服务</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">四、数据存储与安全</h2>
        
        <h3 className="text-xl font-bold mt-6 mb-3">4.1 数据存储</h3>
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li>您的数据存储在Supabase（PostgreSQL数据库）中，服务器位于日本东京</li>
          <li>我们使用SSL加密传输数据</li>
          <li>数据库启用了Row Level Security (RLS)，确保只有您能访问自己的数据</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">4.2 数据安全措施</h3>
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li>定期安全审计和漏洞扫描</li>
          <li>访问控制和权限管理</li>
          <li>数据备份和灾难恢复机制</li>
          <li>员工安全培训</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">五、数据共享与披露</h2>
        
        <p className="text-gray-600 mb-4">我们不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li><strong>服务提供商</strong>：与帮助我们运营平台的第三方服务提供商（如AI服务、云服务）</li>
          <li><strong>法律要求</strong>：根据法律法规、法律程序或政府要求</li>
          <li><strong>权利保护</strong>：保护我们、您或他人的权利、财产或安全</li>
          <li><strong>业务转让</strong>：在合并、收购或资产出售的情况下</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">六、您的权利</h2>
        
        <p className="text-gray-600 mb-4">根据适用的数据保护法律，您享有以下权利：</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li><strong>访问权</strong>：查看我们持有的您的个人信息</li>
          <li><strong>更正权</strong>：更正不准确或不完整的个人信息</li>
          <li><strong>删除权</strong>：请求删除您的个人信息</li>
          <li><strong>限制处理权</strong>：限制我们处理您的个人信息</li>
          <li><strong>数据可携权</strong>：以结构化、通用格式获取您的数据</li>
          <li><strong>反对权</strong>：反对我们处理您的个人信息</li>
        </ul>

        <p className="text-gray-600 mb-4">
          如需行使上述权利，请通过本政策末尾的联系方式与我们联系。
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">七、Cookie和类似技术</h2>
        
        <p className="text-gray-600 mb-4">
          我们使用Cookie和类似技术来改善您的使用体验。Cookie是存储在您设备上的小型文本文件，用于记住您的偏好和使用习惯。
        </p>
        
        <p className="text-gray-600 mb-4">
          您可以通过浏览器设置管理Cookie。但请注意，禁用Cookie可能会影响某些功能的正常使用。
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">八、未成年人保护</h2>
        
        <p className="text-gray-600 mb-4">
          本平台主要面向18岁以上的用户。如果您是未满18周岁的未成年人，请在法定监护人的陪同下使用本平台，并确保监护人同意您使用我们的服务。
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">九、隐私政策的更新</h2>
        
        <p className="text-gray-600 mb-4">
          我们可能会不时更新本隐私政策。更新后的政策将在本页面公布，并注明生效日期。重大变更时，我们会通过平台通知或电子邮件的方式告知您。
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">十、联系我们</h2>
        
        <p className="text-gray-600 mb-4">
          如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：
        </p>
        
        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
          <li><strong>邮箱</strong>：support@ai-career-tool.com</li>
          <li><strong>微信</strong>：ai-career-tool</li>
          <li><strong>地址</strong>：中国</li>
        </ul>

        <p className="text-gray-600 mb-4">
          我们将在15个工作日内回复您的请求。
        </p>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>提示</strong>：使用本平台即表示您已阅读并同意本隐私政策。如果您不同意本政策的任何内容，请停止使用本平台。
          </p>
        </div>
      </div>
    </div>
  );
}
