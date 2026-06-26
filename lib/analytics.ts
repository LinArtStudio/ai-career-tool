"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// 用户行为追踪
export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    
    // 发送页面浏览事件
    trackEvent("page_view", {
      page: url,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  }, [pathname, searchParams]);
}

// 追踪事件
export async function trackEvent(
  eventName: string,
  properties: Record<string, any> = {}
) {
  try {
    // 本地存储（用于离线分析）
    const events = JSON.parse(localStorage.getItem("analytics_events") || "[]");
    events.push({
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
    });
    localStorage.setItem("analytics_events", JSON.stringify(events.slice(-100)));

    // 发送到分析服务（可选）
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ event: eventName, properties }),
    // });
  } catch (error) {
    console.error("Tracking error:", error);
  }
}

// 获取会话ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

// 追踪功能使用
export function trackFeatureUse(feature: string, details?: Record<string, any>) {
  trackEvent("feature_use", { feature, ...details });
}

// 追踪转化
export function trackConversion(type: string, value?: number) {
  trackEvent("conversion", { type, value });
}

// 追踪错误
export function trackError(error: string, context?: string) {
  trackEvent("error", { error, context });
}
