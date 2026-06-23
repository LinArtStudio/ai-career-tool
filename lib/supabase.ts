import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

// 创建Supabase客户端（如果没有配置则为null）
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 检查Supabase是否已配置
export function isSupabaseConfigured(): boolean {
  return supabase !== null
}

// 数据库类型定义
export interface InterviewRecord {
  id?: string
  user_id?: string
  company?: string
  position: string
  question: string
  answer: string
  score: number
  category: string
  difficulty: string
  created_at?: string
}

export interface ResumeRecord {
  id?: string
  user_id?: string
  score: number
  dimensions: Record<string, { score: number; comment: string }>
  issues: Array<{ severity: string; issue: string; fix: string }>
  created_at?: string
}

export interface UserProfile {
  id: string
  email?: string
  phone?: string
  nickname?: string
  avatar_url?: string
  is_premium: boolean
  premium_expires_at?: string
  created_at?: string
}

// 面试记录操作
export async function saveInterviewRecord(record: InterviewRecord) {
  const { data, error } = await supabase
    .from('interview_records')
    .insert(record)
    .select()
  
  if (error) throw error
  return data?.[0]
}

export async function getInterviewRecords(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('interview_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// 简历记录操作
export async function saveResumeRecord(record: ResumeRecord) {
  const { data, error } = await supabase
    .from('resume_records')
    .insert(record)
    .select()
  
  if (error) throw error
  return data?.[0]
}

export async function getResumeRecords(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('resume_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// 用户资料操作
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({ id: userId, ...updates })
    .select()
  
  if (error) throw error
  return data?.[0]
}

// 检查用户是否为付费用户
export async function checkPremiumStatus(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  if (!profile?.is_premium) return false
  
  // 检查是否过期
  if (profile.premium_expires_at) {
    return new Date(profile.premium_expires_at) > new Date()
  }
  
  // 终身会员
  return true
}

// 获取使用统计
export async function getUserStats(userId: string) {
  const [interviews, resumes] = await Promise.all([
    getInterviewRecords(userId, 1000),
    getResumeRecords(userId, 1000)
  ])
  
  const totalInterviews = interviews.length
  const totalResumes = resumes.length
  const avgInterviewScore = interviews.length > 0
    ? Math.round(interviews.reduce((sum, r) => sum + r.score, 0) / interviews.length)
    : 0
  const avgResumeScore = resumes.length > 0
    ? Math.round(resumes.reduce((sum, r) => sum + r.score, 0) / resumes.length)
    : 0
  
  // 最近7天的练习次数
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const recentInterviews = interviews.filter(r => new Date(r.created_at!) > weekAgo).length
  const recentResumes = resumes.filter(r => new Date(r.created_at!) > weekAgo).length
  
  // 按公司统计
  const companyBreakdown: Record<string, { count: number; avgScore: number }> = {}
  interviews.forEach(r => {
    if (r.company) {
      if (!companyBreakdown[r.company]) {
        companyBreakdown[r.company] = { count: 0, avgScore: 0 }
      }
      companyBreakdown[r.company].count++
      companyBreakdown[r.company].avgScore += r.score
    }
  })
  
  // 计算平均分
  Object.keys(companyBreakdown).forEach(company => {
    const stats = companyBreakdown[company]
    stats.avgScore = Math.round(stats.avgScore / stats.count)
  })
  
  return {
    totalInterviews,
    totalResumes,
    avgInterviewScore,
    avgResumeScore,
    recentInterviews,
    recentResumes,
    companyBreakdown
  }
}
