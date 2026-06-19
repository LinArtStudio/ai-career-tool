"use client";
import { useState } from "react";

const TEMPLATES = [
  { id: "tech", name: "互联网技术岗", desc: "适合前端/后端/全栈/算法等技术岗位", color: "blue",
    sections: ["个人信息", "求职意向", "教育背景", "技术技能", "工作经历", "项目经历", "开源贡献", "自我评价"] },
  { id: "product", name: "产品经理", desc: "适合产品经理/产品运营等岗位", color: "purple",
    sections: ["个人信息", "求职意向", "教育背景", "工作经历", "项目经历", "产品技能", "数据能力", "自我评价"] },
  { id: "design", name: "设计师", desc: "适合UI/UX/视觉/交互设计师", color: "pink",
    sections: ["个人信息", "求职意向", "教育背景", "设计技能", "工作经历", "作品集链接", "设计工具", "自我评价"] },
  { id: "finance", name: "金融财务", desc: "适合银行/证券/基金/会计等岗位", color: "green",
    sections: ["个人信息", "求职意向", "教育背景", "专业证书", "工作经历", "项目经历", "专业技能", "自我评价"] },
  { id: "marketing", name: "市场营销", desc: "适合市场/品牌/运营/商务岗位", color: "orange",
    sections: ["个人信息", "求职意向", "教育背景", "工作经历", "项目经历", "营销技能", "数据能力", "自我评价"] },
  { id: "fresh", name: "应届生", desc: "适合无工作经验的应届毕业生", color: "cyan",
    sections: ["个人信息", "求职意向", "教育背景", "实习经历", "校园经历", "项目经历", "技能证书", "自我评价"] },
  { id: "consulting", name: "咨询顾问", desc: "适合管理咨询/战略咨询/IT咨询", color: "indigo",
    sections: ["个人信息", "求职意向", "教育背景", "工作经历", "项目经历", "行业知识", "语言能力", "自我评价"] },
  { id: "education", name: "教育行业", desc: "适合教师/培训师/教研员", color: "teal",
    sections: ["个人信息", "求职意向", "教育背景", "教学经历", "教研成果", "资质证书", "教学技能", "自我评价"] },
  { id: "sales", name: "销售商务", desc: "适合销售/BD/客户经理", color: "red",
    sections: ["个人信息", "求职意向", "教育背景", "工作经历", "业绩数据", "客户资源", "销售技能", "自我评价"] },
  { id: "general", name: "通用模板", desc: "适合所有岗位的简洁模板", color: "gray",
    sections: ["个人信息", "求职意向", "教育背景", "工作经历", "项目经历", "技能清单", "证书荣誉", "自我评价"] },
];

export default function ResumeTemplatesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const template = TEMPLATES.find(t => t.id === selected);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">📋 简历模板库</h1>
      <p className="text-gray-600 mb-8">10套专业中文简历模板，针对不同岗位优化</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TEMPLATES.map(t => (
          <div key={t.id} onClick={() => setSelected(t.id)}
            className={`border rounded-xl p-6 cursor-pointer transition hover:shadow-lg ${selected === t.id ? "border-blue-500 bg-blue-50" : ""}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 bg-${t.color}-100 rounded-lg flex items-center justify-center text-${t.color}-600 font-bold text-lg`}>
                {t.name[0]}
              </div>
              <div>
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {t.sections.map((s, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {template && (
        <div className="bg-white border rounded-xl p-8">
          <h2 className="text-xl font-bold mb-4">{template.name}模板结构</h2>
          <div className="space-y-3">
            {template.sections.map((section, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <div>
                  <div className="font-medium">{section}</div>
                  <div className="text-xs text-gray-500">
                    {section === "个人信息" && "姓名、手机、邮箱、照片"}
                    {section === "求职意向" && "目标岗位、期望城市、期望薪资"}
                    {section === "教育背景" && "学校、专业、学历、GPA"}
                    {section === "工作经历" && "公司、岗位、STAR法则描述"}
                    {section === "项目经历" && "项目名、角色、技术栈、成果"}
                    {section === "技术技能" && "编程语言、框架、工具"}
                    {section === "自我评价" && "100字以内的核心优势总结"}
                    {section === "实习经历" && "公司、岗位、职责、成果"}
                    {section === "校园经历" && "学生会、社团、竞赛"}
                    {section === "产品技能" && "产品工具、数据分析、用户研究"}
                    {section === "设计技能" && "设计工具、设计理念、作品集"}
                    {section === "专业证书" && "CPA/CFA/FRM等"}
                    {section === "业绩数据" && "销售额、客户数、完成率"}
                    {section === "开源贡献" && "GitHub项目、PR、Star数"}
                    {section === "作品集链接" && "Behance/Dribbble/个人网站"}
                    {section === "语言能力" && "英语四六级/雅思/托福"}
                    {section === "资质证书" && "教师资格证/PMP等"}
                    {section === "教学经历" && "授课科目、学生评价"}
                    {section === "教研成果" && "论文、课题、教材"}
                    {section === "行业知识" && "专注行业、研究深度"}
                    {section === "数据能力" && "SQL/Excel/BI工具"}
                    {section === "客户资源" && "行业覆盖、客户规模"}
                    {section === "销售技能" && "谈判、关系维护、方案能力"}
                    {section === "证书荣誉" && "竞赛获奖、奖学金"}
                    {section === "营销技能" && "渠道、投放、内容"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <a href="/resume-builder" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">使用此模板生成简历</a>
            <button onClick={() => {
              const text = template.sections.map((s, i) => `${i + 1}. ${s}`).join("\n");
              navigator.clipboard.writeText(text);
              alert("模板结构已复制");
            }} className="border px-6 py-2 rounded-lg hover:bg-gray-50">📋 复制结构</button>
          </div>
        </div>
      )}
    </div>
  );
}
