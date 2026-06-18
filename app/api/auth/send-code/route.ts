import { NextRequest, NextResponse } from "next/server";
import { saveCode, hasRecentCode } from "@/lib/auth/code-store";
import { sendVerificationEmail } from "@/lib/auth/email-sender";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target, method, captchaToken } = body;

    if (!captchaToken) {
      return NextResponse.json({ error: "请先完成人机验证" }, { status: 400 });
    }

    if (!target || !method) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    if (method === "phone" && !/^1[3-9]\d{9}$/.test(target)) {
      return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 });
    }
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    if (hasRecentCode(method, target)) {
      return NextResponse.json({ error: "请60秒后再试" }, { status: 429 });
    }

    const code = generateCode();
    saveCode(method, target, code);

    if (method === "email") {
      await sendVerificationEmail(target, code);
    } else {
      console.log(`[SMS] ${target}: ${code}`);
    }

    const isDev = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_demo_key";

    return NextResponse.json({
      message: "验证码已发送",
      dev_code: isDev ? code : undefined,
    });
  } catch (err) {
    console.error("Send code error:", err);
    return NextResponse.json({ error: "发送失败" }, { status: 500 });
  }
}
