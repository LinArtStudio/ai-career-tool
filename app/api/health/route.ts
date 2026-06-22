import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    features: {
      resume: true,
      interview: true,
      career: true,
      jdMatch: true,
      coverLetter: true,
      auth: true,
    },
  });
}
