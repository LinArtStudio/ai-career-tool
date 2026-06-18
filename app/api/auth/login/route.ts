import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/auth/code-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, phone, email, code, password } = body;
    const target = method === "phone" ? phone : email;

    if (!target) return NextResponse.json({ error: "请输入手机号或邮箱" }, { status: 400 });
    if (!password) return NextResponse.json({ error: "请输入密码" }, { status: 400 });

    if (code) {
      const valid = verifyCode(method, target, code);
      if (!valid) return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      name: method === "phone" ? phone?.slice(0, 3) + "****" + phone?.slice(7) : email?.split("@")[0],
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
