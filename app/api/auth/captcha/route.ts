import { NextResponse } from "next/server";
import { generateCaptcha } from "@/lib/auth/captcha-store";

export async function GET() {
  const { question, token } = generateCaptcha();
  return NextResponse.json({ question, token });
}
