// ============================================================
// AI简历生成器 - 核心模块
// ============================================================

export interface ResumeInput {
  jobTitle: string;
  jobDescription: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    school: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    role: string;
    achievements: string[];
  }>;
}

export interface GeneratedResume {
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    period: string;
    highlights: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  education: Array<{
    school: string;
    major: string;
    degree: string;
    period: string;
  }>;
  projects?: Array<{
    name: string;
    role: string;
    highlights: string[];
  }>;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
}

// Prompt模板
const RESUME_GENERATE_PROMPT = `你是一位资深HR专家和简历优化顾问，精通ATS系统优化。

请根据以下信息生成一份针对目标岗位的专业简历：

【目标岗位】
{jobTitle}

【岗位描述(JD)】
{jobDescription}

【个人信息】
姓名：{name}
邮箱：{email}
手机：{phone}
地点：{location}

【工作经历】
{experience}

【教育背景】
{education}

【技能清单】
{skills}

【项目经历】
{projects}

请按照以下要求生成简历：

1. **个人简介**：针对目标岗位定制，突出匹配的核心能力
2. **工作经历**：使用STAR法则，量化成果，融入JD关键词
3. **技能清单**：按技术技能、软技能、工具分类，优先展示JD要求的技能
4. **ATS优化**：确保简历能通过ATS系统筛选

输出JSON格式：
{
  "summary": "针对目标岗位的个人简介（100-150字）",
  "experience": [
    {
      "company": "公司名称",
      "position": "职位",
      "period": "时间段",
      "highlights": ["使用STAR法则描述的亮点1", "亮点2"]
    }
  ],
  "skills": {
    "technical": ["技术技能1", "技术技能2"],
    "soft": ["软技能1", "软技能2"],
    "tools": ["工具1", "工具2"]
  },
  "education": [
    {
      "school": "学校",
      "major": "专业",
      "degree": "学位",
      "period": "时间段"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "role": "角色",
      "highlights": ["项目亮点1", "项目亮点2"]
    }
  ],
  "atsScore": 85,
  "keywords": ["从JD提取的关键词1", "关键词2"],
  "suggestions": ["优化建议1", "优化建议2"]
}

要求：
1. 个人简介要针对目标岗位定制
2. 工作经历要使用STAR法则，量化成果
3. 技能清单要优先展示JD要求的技能
4. ATS评分要尽可能高
5. 提供具体的优化建议`;

// 生成简历
export async function generateResume(input: ResumeInput): Promise<GeneratedResume> {
  // 格式化输入
  const experienceText = input.experience
    .map(
      (exp) =>
        `${exp.company} - ${exp.position}（${exp.startDate} - ${exp.endDate || '至今'}）\n` +
        `${exp.description}\n` +
        `成就：${exp.achievements.join('；')}`
    )
    .join('\n\n');

  const educationText = input.education
    .map(
      (edu) =>
        `${edu.school} - ${edu.major} - ${edu.degree}（${edu.startDate} - ${edu.endDate}）`
    )
    .join('\n');

  const projectsText = input.projects
    ? input.projects
        .map(
          (proj) =>
            `${proj.name}（${proj.role}）\n${proj.description}\n成就：${proj.achievements.join('；')}`
        )
        .join('\n\n')
    : '无';

  // 填充Prompt
  const prompt = RESUME_GENERATE_PROMPT
    .replace('{jobTitle}', input.jobTitle)
    .replace('{jobDescription}', input.jobDescription)
    .replace('{name}', input.personalInfo.name)
    .replace('{email}', input.personalInfo.email)
    .replace('{phone}', input.personalInfo.phone)
    .replace('{location}', input.personalInfo.location || '未提供')
    .replace('{experience}', experienceText)
    .replace('{education}', educationText)
    .replace('{skills}', input.skills.join('、'))
    .replace('{projects}', projectsText);

  // 调用LLM
  const { chatWithRetry, parseJSON } = await import('@/lib/llm/deepseek');
  
  const result = await chatWithRetry(
    [
      { role: 'system', content: '你是一位资深HR专家和简历优化顾问。' },
      { role: 'user', content: prompt },
    ],
    {
      max_tokens: 3000,
      temperature: 0.5,
      json_mode: true,
    }
  );

  return parseJSON(result);
}

// 生成简历文本
export function generateResumeText(resume: GeneratedResume, input: ResumeInput): string {
  let text = '';
  
  // 个人信息
  text += `# ${input.personalInfo.name}\n`;
  text += `${input.personalInfo.email} | ${input.personalInfo.phone}`;
  if (input.personalInfo.location) {
    text += ` | ${input.personalInfo.location}`;
  }
  text += '\n\n';
  
  // 个人简介
  text += `## 个人简介\n${resume.summary}\n\n`;
  
  // 工作经历
  text += '## 工作经历\n';
  resume.experience.forEach((exp) => {
    text += `### ${exp.company} - ${exp.position}\n`;
    text += `${exp.period}\n`;
    exp.highlights.forEach((highlight) => {
      text += `- ${highlight}\n`;
    });
    text += '\n';
  });
  
  // 技能清单
  text += '## 技能清单\n';
  text += `**技术技能**：${resume.skills.technical.join('、')}\n`;
  text += `**软技能**：${resume.skills.soft.join('、')}\n`;
  text += `**工具**：${resume.skills.tools.join('、')}\n\n`;
  
  // 教育背景
  text += '## 教育背景\n';
  resume.education.forEach((edu) => {
    text += `### ${edu.school}\n`;
    text += `${edu.major} - ${edu.degree}\n`;
    text += `${edu.period}\n\n`;
  });
  
  // 项目经历
  if (resume.projects && resume.projects.length > 0) {
    text += '## 项目经历\n';
    resume.projects.forEach((proj) => {
      text += `### ${proj.name}\n`;
      text += `角色：${proj.role}\n`;
      proj.highlights.forEach((highlight) => {
        text += `- ${highlight}\n`;
      });
      text += '\n';
    });
  }
  
  return text;
}
