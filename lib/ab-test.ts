// ============================================================
// A/B测试框架 - 优化付费转化
// ============================================================

// 测试配置接口
export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  trafficAllocation: number; // 0-100，参与测试的流量百分比
  startDate: string;
  endDate?: string;
  status: "draft" | "running" | "paused" | "completed";
}

// 测试变体接口
export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-100，流量分配权重
  config: Record<string, any>;
}

// 测试结果接口
export interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: string;
  metrics: {
    conversion: boolean;
    revenue?: number;
    engagement?: number;
  };
}

// 预定义的A/B测试
export const AB_TESTS: Record<string, ABTestConfig> = {
  // 价格测试
  pricing_test: {
    id: "pricing_test",
    name: "定价策略测试",
    description: "测试不同价格点的转化率",
    variants: [
      {
        id: "price_low",
        name: "低价策略",
        description: "AI模拟面试 ¥9.9",
        weight: 33,
        config: {
          interviewPrice: 9.9,
          resumePrice: 7.9,
          sprintMonthly: 29.9,
        },
      },
      {
        id: "price_medium",
        name: "中价策略",
        description: "AI模拟面试 ¥19.9",
        weight: 34,
        config: {
          interviewPrice: 19.9,
          resumePrice: 9.9,
          sprintMonthly: 39.9,
        },
      },
      {
        id: "price_high",
        name: "高价策略",
        description: "AI模拟面试 ¥29.9",
        weight: 33,
        config: {
          interviewPrice: 29.9,
          resumePrice: 14.9,
          sprintMonthly: 49.9,
        },
      },
    ],
    trafficAllocation: 100,
    startDate: "2026-06-24",
    status: "running",
  },

  // 注册流程测试
  signup_flow_test: {
    id: "signup_flow_test",
    name: "注册流程测试",
    description: "测试不同注册流程的转化率",
    variants: [
      {
        id: "flow_simple",
        name: "简化流程",
        description: "只需邮箱即可注册",
        weight: 50,
        config: {
          fields: ["email"],
          steps: 1,
        },
      },
      {
        id: "flow_standard",
        name: "标准流程",
        description: "邮箱+昵称+密码",
        weight: 50,
        config: {
          fields: ["email", "nickname", "password"],
          steps: 2,
        },
      },
    ],
    trafficAllocation: 50,
    startDate: "2026-06-24",
    status: "running",
  },

  // CTA按钮测试
  cta_button_test: {
    id: "cta_button_test",
    name: "CTA按钮测试",
    description: "测试不同CTA文案的点击率",
    variants: [
      {
        id: "cta_free",
        name: "免费导向",
        description: "免费测评AI职业竞争力",
        weight: 50,
        config: {
          text: "🎯 免费测评AI职业竞争力",
          color: "blue",
        },
      },
      {
        id: "cta_value",
        name: "价值导向",
        description: "了解你的AI能力水平",
        weight: 50,
        config: {
          text: "📊 了解你的AI能力水平",
          color: "green",
        },
      },
    ],
    trafficAllocation: 100,
    startDate: "2026-06-24",
    status: "running",
  },
};

// 本地存储键
const AB_TEST_STORAGE_KEY = "ai-career-ab-tests";
const AB_TEST_ASSIGNMENTS_KEY = "ai-career-ab-assignments";

// 获取用户的测试分配
export function getTestAssignment(testId: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(AB_TEST_ASSIGNMENTS_KEY);
    if (data) {
      const assignments = JSON.parse(data);
      return assignments[testId] || null;
    }
  } catch (error) {
    console.error("获取测试分配失败:", error);
  }

  return null;
}

// 保存用户的测试分配
function saveTestAssignment(testId: string, variantId: string): void {
  if (typeof window === "undefined") return;

  try {
    const data = localStorage.getItem(AB_TEST_ASSIGNMENTS_KEY);
    const assignments = data ? JSON.parse(data) : {};
    assignments[testId] = variantId;
    localStorage.setItem(AB_TEST_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error("保存测试分配失败:", error);
  }
}

// 为用户分配测试变体
export function assignTestVariant(testId: string): string | null {
  const test = AB_TESTS[testId];
  if (!test || test.status !== "running") return null;

  // 检查是否已分配
  const existing = getTestAssignment(testId);
  if (existing) return existing;

  // 检查流量分配
  if (Math.random() * 100 > test.trafficAllocation) return null;

  // 根据权重分配变体
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const variant of test.variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      saveTestAssignment(testId, variant.id);
      return variant.id;
    }
  }

  // 默认返回第一个变体
  const defaultVariant = test.variants[0];
  saveTestAssignment(testId, defaultVariant.id);
  return defaultVariant.id;
}

// 获取测试变体配置
export function getTestVariantConfig(
  testId: string,
  variantId: string
): Record<string, any> | null {
  const test = AB_TESTS[testId];
  if (!test) return null;

  const variant = test.variants.find((v) => v.id === variantId);
  return variant?.config || null;
}

// 记录测试结果
export function recordTestResult(result: ABTestResult): void {
  if (typeof window === "undefined") return;

  try {
    const data = localStorage.getItem(AB_TEST_STORAGE_KEY);
    const results: ABTestResult[] = data ? JSON.parse(data) : [];
    results.push(result);
    localStorage.setItem(AB_TEST_STORAGE_KEY, JSON.stringify(results));
  } catch (error) {
    console.error("记录测试结果失败:", error);
  }
}

// 获取测试统计
export function getTestStats(testId: string): {
  totalUsers: number;
  variants: Array<{
    id: string;
    name: string;
    users: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  }>;
} {
  if (typeof window === "undefined") {
    return { totalUsers: 0, variants: [] };
  }

  try {
    const data = localStorage.getItem(AB_TEST_STORAGE_KEY);
    const results: ABTestResult[] = data ? JSON.parse(data) : [];
    const testResults = results.filter((r) => r.testId === testId);

    const test = AB_TESTS[testId];
    if (!test) return { totalUsers: 0, variants: [] };

    const variantStats = test.variants.map((variant) => {
      const variantResults = testResults.filter(
        (r) => r.variantId === variant.id
      );
      const conversions = variantResults.filter(
        (r) => r.metrics.conversion
      ).length;
      const revenue = variantResults.reduce(
        (sum, r) => sum + (r.metrics.revenue || 0),
        0
      );

      return {
        id: variant.id,
        name: variant.name,
        users: variantResults.length,
        conversions,
        conversionRate:
          variantResults.length > 0
            ? (conversions / variantResults.length) * 100
            : 0,
        revenue,
      };
    });

    return {
      totalUsers: testResults.length,
      variants: variantStats,
    };
  } catch (error) {
    console.error("获取测试统计失败:", error);
    return { totalUsers: 0, variants: [] };
  }
}

// 获取推荐价格
export function getRecommendedPrice(testId: string): {
  interviewPrice: number;
  resumePrice: number;
  sprintMonthly: number;
} | null {
  const variantId = getTestAssignment(testId);
  if (!variantId) return null;

  const config = getTestVariantConfig(testId, variantId);
  return config as { interviewPrice: number; resumePrice: number; sprintMonthly: number } | null;
}

// 检查是否为测试用户
export function isTestUser(testId: string): boolean {
  return getTestAssignment(testId) !== null;
}
