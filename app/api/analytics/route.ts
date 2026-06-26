// ============================================================
// 使用统计API - 追踪用户行为
// ============================================================

import { NextRequest, NextResponse } from "next/server";

// 内存存储（生产环境应使用数据库）
const stats = {
  pageViews: {} as Record<string, number>,
  featureUsage: {} as Record<string, number>,
  events: [] as Array<{
    event: string;
    properties: Record<string, any>;
    timestamp: string;
    sessionId: string;
  }>,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, properties } = body;

    if (!event) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }

    // 记录事件
    const eventData = {
      event,
      properties: properties || {},
      timestamp: new Date().toISOString(),
      sessionId: properties?.sessionId || "unknown",
    };

    stats.events.push(eventData);

    // 更新统计
    if (event === "page_view" && properties?.page) {
      stats.pageViews[properties.page] = (stats.pageViews[properties.page] || 0) + 1;
    }

    if (event === "feature_use" && properties?.feature) {
      stats.featureUsage[properties.feature] = (stats.featureUsage[properties.feature] || 0) + 1;
    }

    // 保留最近1000条事件
    if (stats.events.length > 1000) {
      stats.events = stats.events.slice(-1000);
    }

    return NextResponse.json({
      success: true,
      message: "Event tracked",
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    stats: {
      totalEvents: stats.events.length,
      pageViews: stats.pageViews,
      featureUsage: stats.featureUsage,
      recentEvents: stats.events.slice(-10),
    },
  });
}
