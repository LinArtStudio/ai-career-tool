// ============================================================
// 练习进度持久化 - 支持localStorage + Supabase云端同步
// ============================================================

import { supabase, type InterviewRecord, type ResumeRecord } from './supabase'

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

// 获取当前用户ID
async function getCurrentUserId(): Promise<string | null> {
    if (!supabase) return null;
  try {
    if (!supabase) return null
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
  } catch {
    return null
  }
}

// localStorage操作
function getLocalRecords(): PracticeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalRecords(records: PracticeRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

// Supabase操作
async function getCloudRecords(userId: string): Promise<PracticeRecord[]> {
    if (!supabase) return [];
  try {
    const [interviews, resumes] = await Promise.all([
      supabase
        .from('interview_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(500),
      supabase
        .from('resume_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(500)
    ])

    const records: PracticeRecord[] = []

    // 转换面试记录
    if (interviews.data) {
      interviews.data.forEach((r: InterviewRecord) => {
        records.push({
          id: r.id!,
          date: r.created_at!,
          type: "interview",
          company: r.company,
          position: r.position,
          score: r.score,
          details: {
            category: r.category,
            difficulty: r.difficulty,
            question: r.question,
            answer: r.answer
          }
        })
      })
    }

    // 转换简历记录
    if (resumes.data) {
      resumes.data.forEach((r: ResumeRecord) => {
        records.push({
          id: r.id!,
          date: r.created_at!,
          type: "resume",
          score: r.score,
          details: {
            dimensions: r.dimensions,
            issues: r.issues
          }
        })
      })
    }

    // 按时间排序
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return records
  } catch (error) {
    console.error('获取云端记录失败:', error)
    return []
  }
}

async function saveToCloud(record: Omit<PracticeRecord, "id" | "date">): Promise<boolean> {
    if (!supabase) return false;
  try {
    const userId = await getCurrentUserId()
    if (!userId) return false

    if (record.type === "interview") {
      const { error } = await supabase
        .from('interview_records')
        .insert({
          user_id: userId,
          company: record.company,
          position: record.position || '',
          question: (record.details.question as string) || '',
          answer: (record.details.answer as string) || '',
          score: record.score || 0,
          category: (record.details.category as string) || '',
          difficulty: (record.details.difficulty as string) || 'medium'
        })
      
      if (error) throw error
    } else if (record.type === "resume") {
      const { error } = await supabase
        .from('resume_records')
        .insert({
          user_id: userId,
          score: record.score || 0,
          dimensions: record.details.dimensions || {},
          issues: record.details.issues || []
        })
      
      if (error) throw error
    }

    return true
  } catch (error) {
    console.error('保存到云端失败:', error)
    return false
  }
}

// 同步本地数据到云端
async function syncLocalToCloud(): Promise<void> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return

    const localRecords = getLocalRecords()
    if (localRecords.length === 0) return

    // 获取云端记录
    const cloudRecords = await getCloudRecords(userId)
    const cloudIds = new Set(cloudRecords.map(r => r.id))

    // 找出本地独有的记录
    const unsyncedRecords = localRecords.filter(r => !cloudIds.has(r.id))

    // 批量同步到云端
    for (const record of unsyncedRecords) {
      await saveToCloud({
        type: record.type,
        company: record.company,
        position: record.position,
        score: record.score,
        details: record.details
      })
    }

    console.log(`同步了 ${unsyncedRecords.length} 条记录到云端`)
  } catch (error) {
    console.error('同步失败:', error)
  }
}

// 主要导出函数
export async function addRecord(record: Omit<PracticeRecord, "id" | "date">): Promise<void> {
  // 1. 保存到本地
  const localRecords = getLocalRecords();
  const newRecord = {
    ...record,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  localRecords.push(newRecord);
  
  // Keep last 500 records
  if (localRecords.length > 500) localRecords.splice(0, localRecords.length - 500);
  saveLocalRecords(localRecords);

  // 2. 异步保存到云端（不阻塞主流程）
  saveToCloud(record).catch(console.error)
}

export async function getProgress(): Promise<ProgressSummary> {
  // 尝试获取云端数据
  const userId = await getCurrentUserId()
  let records: PracticeRecord[] = []

  if (userId) {
    records = await getCloudRecords(userId)
    // 如果云端没有数据，尝试同步本地数据
    if (records.length === 0) {
      await syncLocalToCloud()
      records = await getCloudRecords(userId)
    }
  }

  // 如果没有云端数据，使用本地数据
  if (records.length === 0) {
    records = getLocalRecords()
  }

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

export async function getRecentRecords(limit: number = 20): Promise<PracticeRecord[]> {
  const userId = await getCurrentUserId()
  if (userId) {
    const cloudRecords = await getCloudRecords(userId)
    if (cloudRecords.length > 0) {
      return cloudRecords.slice(0, limit)
    }
  }
  return getLocalRecords().slice(-limit).reverse();
}

export async function clearProgress(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// 同步本地数据到云端（供手动触发）
export async function syncProgress(): Promise<{ success: boolean; synced: number }> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, synced: 0 }
    }

    const localRecords = getLocalRecords()
    if (localRecords.length === 0) {
      return { success: true, synced: 0 }
    }

    // 获取云端记录
    const cloudRecords = await getCloudRecords(userId)
    const cloudIds = new Set(cloudRecords.map(r => r.id))

    // 找出本地独有的记录
    const unsyncedRecords = localRecords.filter(r => !cloudIds.has(r.id))

    // 批量同步到云端
    let syncedCount = 0
    for (const record of unsyncedRecords) {
      const success = await saveToCloud({
        type: record.type,
        company: record.company,
        position: record.position,
        score: record.score,
        details: record.details
      })
      if (success) syncedCount++
    }

    return { success: true, synced: syncedCount }
  } catch (error) {
    console.error('同步失败:', error)
    return { success: false, synced: 0 }
  }
}
