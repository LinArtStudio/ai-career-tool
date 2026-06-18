import { NextRequest, NextResponse } from "next/server";
import { saveCode, hasRecentCode } from "@/lib/auth/code-store";

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

    // TODO: 接入真实短信/邮件服务
    // 目前：返回验证码供测试
    console.log(`[验证码] ${method}:${target} = ${code}`);

    return NextResponse.json({
      message: `验证码已发送`,
      dev_code: code, // 生产环境删除此行
    });
  } catch (err) {
    console.error("Send code error:", err);
    return NextResponse.json({ error: "发送失败" }, { status: 500 });
  }
}
