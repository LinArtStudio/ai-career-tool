import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("resume_results")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "结果不存在" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Resume fetch error:", err);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
