import nodemailer from "nodemailer";

// QQ邮箱SMTP配置（免费）
// 用户需要在QQ邮箱设置中开启SMTP服务并获取授权码
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.qq.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "", // QQ邮箱地址
    pass: process.env.SMTP_PASS || "", // QQ邮箱授权码（不是密码）
  },
});

export async function sendVerificationEmail(to: string, code: string): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email] SMTP未配置，验证码: ${code}`);
    return true; // 开发模式，返回成功
  }

  try {
    await transporter.sendMail({
      from: `"AI求职助手" <${process.env.SMTP_USER}>`,
      to,
      subject: "【AI求职助手】验证码",
      html: `
        <div style="max-width:500px;margin:0 auto;padding:20px;font-family:sans-serif;">
          <h2 style="color:#2563eb;">AI求职助手</h2>
          <p>您的验证码是：</p>
          <div style="font-size:32px;font-weight:bold;color:#2563eb;letter-spacing:8px;padding:15px;background:#f0f7ff;border-radius:8px;text-align:center;">
            ${code}
          </div>
          <p style="color:#666;font-size:14px;">验证码5分钟内有效，请勿泄露给他人。</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}
