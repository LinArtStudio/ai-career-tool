// ============================================================
// 用户认证模块 - Supabase Auth
// ============================================================

import { supabase } from './supabase'

export interface User {
  id: string
  email?: string
  phone?: string
  nickname?: string
  avatar_url?: string
  is_premium: boolean
}

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // 获取用户资料
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      nickname: profile?.nickname || user.email?.split('@')[0] || '用户',
      avatar_url: profile?.avatar_url,
      is_premium: profile?.is_premium || false
    }
  } catch (error) {
    console.error('获取用户失败:', error)
    return null
  }
}

// 发送邮箱验证码
export async function sendEmailCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true
      }
    })

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || '发送验证码失败' }
  }
}

// 验证邮箱验证码
export async function verifyEmailCode(email: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })

    if (error) throw error

    // 创建或更新用户资料
    const user = await getCurrentUser()
    if (user) {
      await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          nickname: user.email?.split('@')[0] || '用户'
        })
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || '验证码错误' }
  }
}

// 发送手机验证码
export async function sendPhoneCode(phone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone
    })

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || '发送验证码失败' }
  }
}

// 验证手机验证码
export async function verifyPhoneCode(phone: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    })

    if (error) throw error

    // 创建或更新用户资料
    const user = await getCurrentUser()
    if (user) {
      await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          phone: user.phone,
          nickname: '用户' + phone.slice(-4)
        })
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || '验证码错误' }
  }
}

// 退出登录
export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

// 监听认证状态变化
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else if (event === 'SIGNED_OUT') {
      callback(null)
    }
  })
}

// 检查是否为付费用户
export async function checkPremiumStatus(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  // 检查是否过期
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_premium, premium_expires_at')
    .eq('id', user.id)
    .single()

  if (!profile?.is_premium) return false

  // 终身会员
  if (!profile.premium_expires_at) return true

  // 检查是否过期
  return new Date(profile.premium_expires_at) > new Date()
}

// 更新用户资料
export async function updateUserProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '用户未登录' }
    }

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || '更新失败' }
  }
}
