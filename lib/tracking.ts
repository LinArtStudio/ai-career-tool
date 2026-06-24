// ============================================================
// 用户行为追踪 - 收集用户行为数据
// ============================================================

// 事件类型
export type EventType =
  | "page_view"
  | "quiz_start"
  | "quiz_complete"
  | "interview_start"
  | "interview_complete"
  | "resume_upload"
  | "resume_analyze"
  | "jd_match"
  | "signup_start"
  | "signup_complete"
  | "login"
  | "logout"
  | "payment_start"
  | "payment_complete"
  | "payment_cancel"
  | "referral_share"
  | "referral_click"
  | "cta_click"
  | "feature_use";

// 事件数据接口
export interface TrackingEvent {
  id: string;
  userId?: string;
  sessionId: string;
  eventType: EventType;
  timestamp: string;
  data: Record<string, any>;
  page: string;
  userAgent: string;
}

// 会话信息
interface SessionInfo {
  id: string;
  startTime: string;
  lastActivity: string;
  pageViews: number;
}

// 本地存储键
const TRACKING_STORAGE_KEY = "ai-career-tracking";
const SESSION_STORAGE_KEY = "ai-career-session";

// 获取或创建会话
function getSession(): SessionInfo {
  if (typeof window === "undefined") {
    return {
      id: "server",
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      pageViews: 0,
    };
  }

  try {
    const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (data) {
      const session = JSON.parse(data);
      session.lastActivity = new Date().toISOString();
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return session;
    }
  } catch (error) {
    console.error("获取会话失败:", error);
  }

  // 创建新会话
  const newSession: SessionInfo = {
    id: generateSessionId(),
    startTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    pageViews: 0,
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
  } catch (error) {
    console.error("保存会话失败:", error);
  }

  return newSession;
}

// 生成会话ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// 生成事件ID
function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// 追踪事件
export function trackEvent(
  eventType: EventType,
  data: Record<string, any> = {},
  userId?: string
): void {
  if (typeof window === "undefined") return;

  try {
    const session = getSession();
    const event: TrackingEvent = {
      id: generateEventId(),
      userId,
      sessionId: session.id,
      eventType,
      timestamp: new Date().toISOString(),
      data,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
    };

    // 保存到本地存储
    const stored = localStorage.getItem(TRACKING_STORAGE_KEY);
    const events: TrackingEvent[] = stored ? JSON.parse(stored) : [];
    events.push(event);

    // 限制存储数量（保留最近1000条）
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }

    localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(events));

    // 更新会话
    session.pageViews++;
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    // 开发环境下打印日志
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Tracking:", eventType, data);
    }
  } catch (error) {
    console.error("追踪事件失败:", error);
  }
}

// 页面浏览追踪
export function trackPageView(page: string, data: Record<string, any> = {}): void {
  trackEvent("page_view", { page, ...data });
}

// 功能使用追踪
export function trackFeatureUse(feature: string, data: Record<string, any> = {}): void {
  trackEvent("feature_use", { feature, ...data });
}

// 转化追踪
export function trackConversion(
  conversionType: string,
  value?: number,
  data: Record<string, any> = {}
): void {
  trackEvent("payment_complete", {
    conversionType,
    value,
    ...data,
  });
}

// 获取追踪数据
export function getTrackingData(): TrackingEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(TRACKING_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("获取追踪数据失败:", error);
    return [];
  }
}

// 获取转化漏斗数据
export function getConversionFunnel(): {
  quizStart: number;
  quizComplete: number;
  signupStart: number;
  signupComplete: number;
  paymentStart: number;
  paymentComplete: number;
  conversionRates: {
    quizToSignup: number;
    signupToPayment: number;
    overall: number;
  };
} {
  const events = getTrackingData();

  const quizStart = events.filter((e) => e.eventType === "quiz_start").length;
  const quizComplete = events.filter(
    (e) => e.eventType === "quiz_complete"
  ).length;
  const signupStart = events.filter(
    (e) => e.eventType === "signup_start"
  ).length;
  const signupComplete = events.filter(
    (e) => e.eventType === "signup_complete"
  ).length;
  const paymentStart = events.filter(
    (e) => e.eventType === "payment_start"
  ).length;
  const paymentComplete = events.filter(
    (e) => e.eventType === "payment_complete"
  ).length;

  return {
    quizStart,
    quizComplete,
    signupStart,
    signupComplete,
    paymentStart,
    paymentComplete,
    conversionRates: {
      quizToSignup: quizComplete > 0 ? (signupComplete / quizComplete) * 100 : 0,
      signupToPayment:
        signupComplete > 0 ? (paymentComplete / signupComplete) * 100 : 0,
      overall: quizStart > 0 ? (paymentComplete / quizStart) * 100 : 0,
    },
  };
}

// 获取页面访问统计
export function getPageViewStats(): Array<{
  page: string;
  views: number;
  uniqueUsers: number;
}> {
  const events = getTrackingData();
  const pageViews = events.filter((e) => e.eventType === "page_view");

  const pageStats: Record<
    string,
    { views: number; users: Set<string> }
  > = {};

  pageViews.forEach((event) => {
    const page = event.data.page || event.page;
    if (!pageStats[page]) {
      pageStats[page] = { views: 0, users: new Set() };
    }
    pageStats[page].views++;
    if (event.userId) {
      pageStats[page].users.add(event.userId);
    }
  });

  return Object.entries(pageStats)
    .map(([page, stats]) => ({
      page,
      views: stats.views,
      uniqueUsers: stats.users.size,
    }))
    .sort((a, b) => b.views - a.views);
}

// 获取功能使用统计
export function getFeatureUsageStats(): Array<{
  feature: string;
  usage: number;
}> {
  const events = getTrackingData();
  const featureEvents = events.filter((e) => e.eventType === "feature_use");

  const featureStats: Record<string, number> = {};

  featureEvents.forEach((event) => {
    const feature = event.data.feature;
    if (feature) {
      featureStats[feature] = (featureStats[feature] || 0) + 1;
    }
  });

  return Object.entries(featureStats)
    .map(([feature, usage]) => ({ feature, usage }))
    .sort((a, b) => b.usage - a.usage);
}

// 清除追踪数据
export function clearTrackingData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TRACKING_STORAGE_KEY);
}
