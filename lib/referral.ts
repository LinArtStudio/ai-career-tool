// ============================================================
// 用户邀请机制 - 邀请好友得奖励
// ============================================================

// 邀请配置
export const REFERRAL_CONFIG = {
  // 邀请人奖励
  referrer: {
    points: 100, // 积分奖励
    freeInterviews: 1, // 免费模拟面试次数
    freeResumeRewrite: 1, // 免费AI改简历次数
  },
  // 被邀请人奖励
  referee: {
    points: 50, // 积分奖励
    freeInterviews: 1, // 免费模拟面试次数
    freeResumeRewrite: 1, // 免费AI改简历次数
    discount: 0.1, // 首次付费折扣（10%）
  },
  // 邀请码配置
  codeLength: 8,
  codePrefix: "AI",
};

// 邀请记录接口
export interface ReferralRecord {
  id: string;
  referrerId: string; // 邀请人ID
  refereeId: string; // 被邀请人ID
  referralCode: string; // 邀请码
  status: "pending" | "completed" | "expired";
  createdAt: string;
  completedAt?: string;
  rewards: {
    referrerRewarded: boolean;
    refereeRewarded: boolean;
  };
}

// 生成邀请码
export function generateReferralCode(userId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  const userHash = userId.substring(0, 4);
  return `${REFERRAL_CONFIG.codePrefix}${timestamp}${random}${userHash}`.toUpperCase();
}

// 本地存储键
const REFERRAL_STORAGE_KEY = "ai-career-referrals";
const REFERRAL_CODE_KEY = "ai-career-referral-code";

// 获取用户的邀请码
export function getReferralCode(userId: string): string {
  if (typeof window === "undefined") return "";

  try {
    const stored = localStorage.getItem(REFERRAL_CODE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.userId === userId && data.code) {
        return data.code;
      }
    }

    // 生成新的邀请码
    const code = generateReferralCode(userId);
    localStorage.setItem(
      REFERRAL_CODE_KEY,
      JSON.stringify({ userId, code, createdAt: new Date().toISOString() })
    );
    return code;
  } catch (error) {
    console.error("获取邀请码失败:", error);
    return generateReferralCode(userId);
  }
}

// 获取邀请记录
export function getReferralRecords(): ReferralRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(REFERRAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("获取邀请记录失败:", error);
    return [];
  }
}

// 保存邀请记录
function saveReferralRecords(records: ReferralRecord[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("保存邀请记录失败:", error);
  }
}

// 记录邀请
export function recordReferral(
  referrerId: string,
  refereeId: string,
  referralCode: string
): { success: boolean; message: string } {
  const records = getReferralRecords();

  // 检查是否已经邀请过
  const existing = records.find(
    (r) => r.referrerId === referrerId && r.refereeId === refereeId
  );
  if (existing) {
    return { success: false, message: "该用户已经被邀请过" };
  }

  // 检查邀请码是否有效
  const referrerCode = getReferralCode(referrerId);
  if (referralCode !== referrerCode) {
    return { success: false, message: "邀请码无效" };
  }

  // 创建邀请记录
  const record: ReferralRecord = {
    id: Date.now().toString(),
    referrerId,
    refereeId,
    referralCode,
    status: "pending",
    createdAt: new Date().toISOString(),
    rewards: {
      referrerRewarded: false,
      refereeRewarded: false,
    },
  };

  records.push(record);
  saveReferralRecords(records);

  return { success: true, message: "邀请记录已创建" };
}

// 完成邀请（被邀请人完成注册或首次付费）
export function completeReferral(
  referrerId: string,
  refereeId: string
): { success: boolean; message: string; rewards?: typeof REFERRAL_CONFIG.referrer } {
  const records = getReferralRecords();
  const record = records.find(
    (r) =>
      r.referrerId === referrerId &&
      r.refereeId === refereeId &&
      r.status === "pending"
  );

  if (!record) {
    return { success: false, message: "未找到待完成的邀请记录" };
  }

  // 更新记录状态
  record.status = "completed";
  record.completedAt = new Date().toISOString();
  record.rewards.referrerRewarded = true;
  record.rewards.refereeRewarded = true;

  saveReferralRecords(records);

  return {
    success: true,
    message: "邀请完成，奖励已发放",
    rewards: REFERRAL_CONFIG.referrer,
  };
}

// 获取邀请统计
export function getReferralStats(userId: string): {
  totalInvites: number;
  completedInvites: number;
  pendingInvites: number;
  totalPointsEarned: number;
  totalFreeInterviews: number;
  totalFreeResumeRewrite: number;
} {
  const records = getReferralRecords();
  const userRecords = records.filter((r) => r.referrerId === userId);

  const completed = userRecords.filter((r) => r.status === "completed");
  const pending = userRecords.filter((r) => r.status === "pending");

  return {
    totalInvites: userRecords.length,
    completedInvites: completed.length,
    pendingInvites: pending.length,
    totalPointsEarned: completed.length * REFERRAL_CONFIG.referrer.points,
    totalFreeInterviews: completed.length * REFERRAL_CONFIG.referrer.freeInterviews,
    totalFreeResumeRewrite: completed.length * REFERRAL_CONFIG.referrer.freeResumeRewrite,
  };
}

// 检查用户是否被邀请
export function checkIfReferred(userId: string): {
  isReferred: boolean;
  referrerId?: string;
  referralCode?: string;
} {
  const records = getReferralRecords();
  const record = records.find((r) => r.refereeId === userId);

  if (record) {
    return {
      isReferred: true,
      referrerId: record.referrerId,
      referralCode: record.referralCode,
    };
  }

  return { isReferred: false };
}

// 获取邀请链接
export function getReferralLink(userId: string): string {
  const code = getReferralCode(userId);
  return `https://ai-career-tool.vercel.app/quiz?ref=${code}`;
}

// 获取邀请分享文案
export function getReferralShareText(userId: string): string {
  const link = getReferralLink(userId);
  return `🎯 AI产品经理求职神器！

我最近发现了一个超棒的AI时代求职训练平台，包含：
✅ AI职业竞争力测评（免费）
✅ 面试问题预测（独家）
✅ 150+大厂真题
✅ AI模拟面试

现在注册还能获得：
🎁 免费模拟面试1次（价值¥19.9）
🎁 免费AI改简历1次（价值¥9.9）
🎁 50积分奖励

点击链接立即体验：
${link}

#AI产品经理 #求职 #面试 #AI求职`;
}
