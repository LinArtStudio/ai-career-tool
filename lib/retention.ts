// ============================================================
// 用户留存系统 - 每日签到、练习打卡、进度追踪
// ============================================================

export interface UserProgress {
  userId: string;
  totalPoints: number;
  streak: number;
  lastCheckIn: string | null;
  checkInHistory: Record<string, boolean>;
  practiceHistory: PracticeRecord[];
  achievements: Achievement[];
}

export interface PracticeRecord {
  id: string;
  date: string;
  type: "interview" | "resume" | "jd-match" | "quiz";
  score?: number;
  duration?: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  condition: string;
}

// 积分规则
export const POINTS_RULES = {
  dailyCheckIn: 10,
  practiceComplete: 20,
  interviewComplete: 30,
  quizComplete: 50,
  streakBonus: (days: number) => Math.min(days * 5, 100), // 连续签到奖励，最高100
};

// 成就定义
export const ACHIEVEMENTS = [
  {
    id: "first_checkin",
    name: "初来乍到",
    description: "完成第一次签到",
    icon: "🎯",
    condition: "签到1次",
  },
  {
    id: "streak_3",
    name: "三天打鱼",
    description: "连续签到3天",
    icon: "🔥",
    condition: "连续签到3天",
  },
  {
    id: "streak_7",
    name: "一周坚持",
    description: "连续签到7天",
    icon: "⭐",
    condition: "连续签到7天",
  },
  {
    id: "streak_30",
    name: "月度达人",
    description: "连续签到30天",
    icon: "👑",
    condition: "连续签到30天",
  },
  {
    id: "practice_10",
    name: "勤学苦练",
    description: "完成10次练习",
    icon: "📚",
    condition: "完成10次练习",
  },
  {
    id: "practice_50",
    name: "练习达人",
    description: "完成50次练习",
    icon: "🏆",
    condition: "完成50次练习",
  },
  {
    id: "interview_5",
    name: "面试新手",
    description: "完成5次模拟面试",
    icon: "🎤",
    condition: "完成5次模拟面试",
  },
  {
    id: "interview_20",
    name: "面试高手",
    description: "完成20次模拟面试",
    icon: "💎",
    condition: "完成20次模拟面试",
  },
  {
    id: "quiz_master",
    name: "测评专家",
    description: "完成AI职业竞争力测评",
    icon: "🎯",
    condition: "完成测评",
  },
  {
    id: "score_80",
    name: "优秀学员",
    description: "模拟面试平均分达到80分",
    icon: "🌟",
    condition: "平均分≥80",
  },
];

// 本地存储键
const STORAGE_KEY = "ai-career-progress";

// 获取用户进度
export function getUserProgress(): UserProgress {
  if (typeof window === "undefined") {
    return getDefaultProgress();
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("读取用户进度失败:", error);
  }

  return getDefaultProgress();
}

// 获取默认进度
function getDefaultProgress(): UserProgress {
  return {
    userId: "",
    totalPoints: 0,
    streak: 0,
    lastCheckIn: null,
    checkInHistory: {},
    practiceHistory: [],
    achievements: [],
  };
}

// 保存用户进度
function saveUserProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("保存用户进度失败:", error);
  }
}

// 每日签到
export function dailyCheckIn(): {
  success: boolean;
  points: number;
  streak: number;
  message: string;
} {
  const progress = getUserProgress();
  const today = new Date().toISOString().split("T")[0];

  // 检查是否已签到
  if (progress.checkInHistory[today]) {
    return {
      success: false,
      points: 0,
      streak: progress.streak,
      message: "今天已经签到过了，明天再来吧！",
    };
  }

  // 检查连续签到
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (progress.lastCheckIn === yesterdayStr) {
    progress.streak += 1;
  } else if (progress.lastCheckIn !== today) {
    progress.streak = 1;
  }

  // 计算积分
  let points = POINTS_RULES.dailyCheckIn;
  points += POINTS_RULES.streakBonus(progress.streak);

  // 更新进度
  progress.totalPoints += points;
  progress.lastCheckIn = today;
  progress.checkInHistory[today] = true;

  // 检查成就
  checkAchievements(progress);

  // 保存
  saveUserProgress(progress);

  return {
    success: true,
    points,
    streak: progress.streak,
    message: `签到成功！获得${points}积分，连续签到${progress.streak}天`,
  };
}

// 记录练习
export function recordPractice(record: Omit<PracticeRecord, "id" | "date">): {
  success: boolean;
  points: number;
  message: string;
} {
  const progress = getUserProgress();

  // 创建记录
  const practiceRecord: PracticeRecord = {
    ...record,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };

  // 添加到历史
  progress.practiceHistory.push(practiceRecord);

  // 计算积分
  let points = POINTS_RULES.practiceComplete;
  if (record.type === "interview") {
    points = POINTS_RULES.interviewComplete;
  } else if (record.type === "quiz") {
    points = POINTS_RULES.quizComplete;
  }

  progress.totalPoints += points;

  // 检查成就
  checkAchievements(progress);

  // 保存
  saveUserProgress(progress);

  return {
    success: true,
    points,
    message: `练习完成！获得${points}积分`,
  };
}

// 检查成就
function checkAchievements(progress: UserProgress): void {
  const newAchievements: Achievement[] = [];

  // 检查签到成就
  if (progress.streak >= 1 && !hasAchievement(progress, "first_checkin")) {
    newAchievements.push(getAchievement("first_checkin")!);
  }
  if (progress.streak >= 3 && !hasAchievement(progress, "streak_3")) {
    newAchievements.push(getAchievement("streak_3")!);
  }
  if (progress.streak >= 7 && !hasAchievement(progress, "streak_7")) {
    newAchievements.push(getAchievement("streak_7")!);
  }
  if (progress.streak >= 30 && !hasAchievement(progress, "streak_30")) {
    newAchievements.push(getAchievement("streak_30")!);
  }

  // 检查练习成就
  const practiceCount = progress.practiceHistory.length;
  if (practiceCount >= 10 && !hasAchievement(progress, "practice_10")) {
    newAchievements.push(getAchievement("practice_10")!);
  }
  if (practiceCount >= 50 && !hasAchievement(progress, "practice_50")) {
    newAchievements.push(getAchievement("practice_50")!);
  }

  // 检查面试成就
  const interviewCount = progress.practiceHistory.filter(
    (r) => r.type === "interview"
  ).length;
  if (interviewCount >= 5 && !hasAchievement(progress, "interview_5")) {
    newAchievements.push(getAchievement("interview_5")!);
  }
  if (interviewCount >= 20 && !hasAchievement(progress, "interview_20")) {
    newAchievements.push(getAchievement("interview_20")!);
  }

  // 检查测评成就
  const hasQuiz = progress.practiceHistory.some((r) => r.type === "quiz");
  if (hasQuiz && !hasAchievement(progress, "quiz_master")) {
    newAchievements.push(getAchievement("quiz_master")!);
  }

  // 检查分数成就
  const interviewScores = progress.practiceHistory
    .filter((r) => r.type === "interview" && r.score)
    .map((r) => r.score!);
  if (interviewScores.length > 0) {
    const avgScore =
      interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length;
    if (avgScore >= 80 && !hasAchievement(progress, "score_80")) {
      newAchievements.push(getAchievement("score_80")!);
    }
  }

  // 添加新成就
  progress.achievements.push(
    ...newAchievements.map((a) => ({
      ...a,
      unlockedAt: new Date().toISOString(),
    }))
  );
}

// 检查是否有成就
function hasAchievement(progress: UserProgress, achievementId: string): boolean {
  return progress.achievements.some((a) => a.id === achievementId);
}

// 获取成就定义
function getAchievement(achievementId: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === achievementId);
}

// 获取统计数据
export function getStats(): {
  totalPoints: number;
  streak: number;
  totalPractice: number;
  interviewCount: number;
  resumeCount: number;
  jdMatchCount: number;
  quizCount: number;
  avgInterviewScore: number;
  achievementCount: number;
} {
  const progress = getUserProgress();

  const interviewRecords = progress.practiceHistory.filter(
    (r) => r.type === "interview"
  );
  const interviewScores = interviewRecords
    .filter((r) => r.score)
    .map((r) => r.score!);

  return {
    totalPoints: progress.totalPoints,
    streak: progress.streak,
    totalPractice: progress.practiceHistory.length,
    interviewCount: interviewRecords.length,
    resumeCount: progress.practiceHistory.filter((r) => r.type === "resume")
      .length,
    jdMatchCount: progress.practiceHistory.filter((r) => r.type === "jd-match")
      .length,
    quizCount: progress.practiceHistory.filter((r) => r.type === "quiz").length,
    avgInterviewScore:
      interviewScores.length > 0
        ? Math.round(
            interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length
          )
        : 0,
    achievementCount: progress.achievements.length,
  };
}

// 获取连续签到天数
export function getStreak(): number {
  return getUserProgress().streak;
}

// 检查今天是否已签到
export function hasCheckedInToday(): boolean {
  const today = new Date().toISOString().split("T")[0];
  return getUserProgress().checkInHistory[today] || false;
}

// 获取最近7天签到情况
export function getRecentCheckIns(): boolean[] {
  const progress = getUserProgress();
  const result: boolean[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    result.push(progress.checkInHistory[dateStr] || false);
  }

  return result;
}
