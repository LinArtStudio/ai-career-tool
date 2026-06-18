import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/auth/code-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, phone, email, code, password } = body;
    const target = method === "phone" ? phone : email;

    if (!target) return NextResponse.json({ error: "请输入手机号或邮箱" }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ error: "密码至少6位" }, { status: 400 });
    if (!code) return NextResponse.json({ error: "请先获取验证码" }, { status: 400 });

    const valid = verifyCode(method, target, code);
    if (!valid) return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 });

    console.log(`[Register] ${method}=${target}`);
    return NextResponse.json({
      success: true,
      name: method === "phone" ? phone?.slice(0, 3) + "****" + phone?.slice(7) : email?.split("@")[0],
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
