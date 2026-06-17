import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { email, password, nickname } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "请填写邮箱和密码" }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname: nickname || email.split("@")[0] },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 创建用户扩展信息
    if (data.user) {
      await supabase.from("user_profiles").upsert({
        id: data.user.id,
        nickname: nickname || email.split("@")[0],
        plan: "free",
      });
    }

    return NextResponse.json({ user: data.user, message: "注册成功！" });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
