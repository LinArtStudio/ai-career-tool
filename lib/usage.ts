// ============================================================
// 免费额度管理系统 - 使用localStorage
// ============================================================

export type FeatureKey = "resume-diagnose" | "jd-match" | "career-plan" | "interview-preview" | "resume-rewrite" | "resume-build" | "interview-full" | "cover-letter";

interface UsageRecord {
  date: string;
  count: number;
}

interface UsageStore {
  [key: string]: UsageRecord;
}

// 免费额度配置
const FREE_LIMITS: Record<FeatureKey, number> = {
  "resume-diagnose": 3,      // 每天3次
  "jd-match": 3,             // 每天3次
  "career-plan": 1,          // 每天1次
  "interview-preview": 1,    // 每天1题
  "resume-rewrite": 0,       // 付费
  "resume-build": 0,         // 付费
  "interview-full": 0,       // 付费
  "cover-letter": 0,         // 付费
};

const STORAGE_KEY = "ai-career-usage";
const PAID_KEY = "ai-career-paid";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getStore(): UsageStore {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveStore(store: UsageStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

// 检查是否是付费用户
export function isPaidUser(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PAID_KEY) === "true";
}

// 设置付费状态
export function setPaidUser(paid: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PAID_KEY, paid ? "true" : "false");
}

// 获取今日已使用次数
export function getUsageCount(feature: FeatureKey): number {
  const store = getStore();
  const today = getToday();
  const record = store[feature];
  if (!record || record.date !== today) return 0;
  return record.count;
}

// 获取剩余次数
export function getRemainingUses(feature: FeatureKey): number {
  if (isPaidUser()) return Infinity;
  const limit = FREE_LIMITS[feature];
  if (limit === 0) return 0; // 付费功能，免费用户无额度
  const used = getUsageCount(feature);
  return Math.max(0, limit - used);
}

// 检查是否可以使用
export function canUse(feature: FeatureKey): boolean {
  if (isPaidUser()) return true;
  const limit = FREE_LIMITS[feature];
  if (limit === 0) return false; // 付费功能
  return getUsageCount(feature) < limit;
}

// 记录使用
export function recordUsage(feature: FeatureKey): void {
  const store = getStore();
  const today = getToday();
  if (!store[feature] || store[feature].date !== today) {
    store[feature] = { date: today, count: 1 };
  } else {
    store[feature].count++;
  }
  saveStore(store);
}

// 获取所有功能的使用状态
export function getAllUsageStatus(): Record<FeatureKey, { used: number; limit: number; canUse: boolean; isPaid: boolean }> {
  const paid = isPaidUser();
  const result = {} as Record<FeatureKey, { used: number; limit: number; canUse: boolean; isPaid: boolean }>;
  for (const key of Object.keys(FREE_LIMITS) as FeatureKey[]) {
    const limit = FREE_LIMITS[key];
    const used = getUsageCount(key);
    result[key] = {
      used,
      limit,
      canUse: paid || (limit > 0 && used < limit),
      isPaid: limit === 0,
    };
  }
  return result;
}

// 获取功能的免费额度说明
export function getFeatureLimitText(feature: FeatureKey): string {
  if (isPaidUser()) return "无限使用";
  const limit = FREE_LIMITS[feature];
  if (limit === 0) return "付费功能";
  const used = getUsageCount(feature);
  return `今日${used}/${limit}次`;
}
