import { NextRequest, NextResponse } from "next/server";

// Server-side usage tracking (in-memory, resets on restart)
// For production, use Redis or database
const usageStore: Record<string, { date: string; count: number }> = {};

const FREE_LIMITS: Record<string, number> = {
  "/api/demo/resume": 3,
  "/api/demo/jd-match": 3,
  "/api/demo/career": 1,
  "/api/demo/interview-preview": 1,
};

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function checkUsageLimit(req: NextRequest, path: string): NextResponse | null {
  // Paid features have no free limit (handled by frontend)
  if (!(path in FREE_LIMITS)) return null;
  
  const ip = getClientIP(req);
  const key = `${ip}:${path}`;
  const today = getToday();
  
  if (!usageStore[key] || usageStore[key].date !== today) {
    usageStore[key] = { date: today, count: 0 };
  }
  
  if (usageStore[key].count >= FREE_LIMITS[path]) {
    return NextResponse.json(
      { error: "免费额度已用完，请付费继续使用", code: "LIMIT_EXCEEDED" },
      { status: 429 }
    );
  }
  
  usageStore[key].count++;
  return null;
}
