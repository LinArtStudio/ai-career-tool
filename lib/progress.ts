// ============================================================
// 练习进度持久化 - 使用localStorage
// ============================================================

export interface PracticeRecord {
  id: string;
  date: string;
  type: "interview" | "resume" | "career" | "jd-match";
  company?: string;
  position?: string;
  score?: number;
  details: Record<string, unknown>;
}

export interface ProgressSummary {
  totalSessions: number;
  averageScore: number;
  recentScores: number[];
  companyBreakdown: Record<string, { count: number; avgScore: number }>;
  categoryBreakdown: Record<string, { count: number; avgScore: number }>;
  streak: number;
}

const STORAGE_KEY = "ai-career-progress";

function getRecords(): PracticeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: PracticeRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

export function addRecord(record: Omit<PracticeRecord, "id" | "date">): void {
  const records = getRecords();
  records.push({
    ...record,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  });
  // Keep last 500 records
  if (records.length > 500) records.splice(0, records.length - 500);
  saveRecords(records);
}

export function getProgress(): ProgressSummary {
  const records = getRecords();
  const interviewRecords = records.filter(r => r.type === "interview" && r.score);
  const scores = interviewRecords.map(r => r.score!);

  const companyBreakdown: Record<string, { count: number; total: number }> = {};
  const categoryBreakdown: Record<string, { count: number; total: number }> = {};

  interviewRecords.forEach(r => {
    if (r.company) {
      if (!companyBreakdown[r.company]) companyBreakdown[r.company] = { count: 0, total: 0 };
      companyBreakdown[r.company].count++;
      companyBreakdown[r.company].total += r.score!;
    }
    if (r.details?.category) {
      const cat = r.details.category as string;
      if (!categoryBreakdown[cat]) categoryBreakdown[cat] = { count: 0, total: 0 };
      categoryBreakdown[cat].count++;
      categoryBreakdown[cat].total += r.score!;
    }
  });

  // Calculate streak
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    if (records.some(r => r.date.startsWith(dateStr))) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalSessions: interviewRecords.length,
    averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    recentScores: scores.slice(-10),
    companyBreakdown: Object.fromEntries(
      Object.entries(companyBreakdown).map(([k, v]) => [k, { count: v.count, avgScore: Math.round(v.total / v.count) }])
    ),
    categoryBreakdown: Object.fromEntries(
      Object.entries(categoryBreakdown).map(([k, v]) => [k, { count: v.count, avgScore: Math.round(v.total / v.count) }])
    ),
    streak,
  };
}

export function getRecentRecords(limit: number = 20): PracticeRecord[] {
  return getRecords().slice(-limit).reverse();
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
