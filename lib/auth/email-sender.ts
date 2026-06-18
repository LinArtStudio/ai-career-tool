import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_demo_key");

export async function sendVerificationEmail(to: string, code: string): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_demo_key") {
      // Demo mode - just log
      console.log(`[Email Demo] ${to}: ${code}`);
      return true;
    }

    await resend.emails.send({
      from: "AI求职助手 <noreply@ai-career-tool.com>",
      to,
      subject: "【AI求职助手】验证码",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">AI求职助手</h2>
          <p>您的验证码是：</p>
          <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; padding: 16px; background: #f0f7ff; border-radius: 8px; text-align: center;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">验证码5分钟内有效。如非本人操作，请忽略此邮件。</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}
