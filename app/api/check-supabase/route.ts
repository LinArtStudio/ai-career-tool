// ============================================================
// Supabase配置检查脚本
// 用于验证Supabase配置是否正确
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function checkSupabaseConfig(): Promise<{
  success: boolean
  message: string
  details: Record<string, any>
}> {
  const details: Record<string, any> = {
    urlConfigured: !!supabaseUrl,
    keyConfigured: !!supabaseAnonKey,
    urlFormat: supabaseUrl?.startsWith('https://') && supabaseUrl?.endsWith('.supabase.co'),
    keyFormat: supabaseAnonKey?.startsWith('eyJ') || supabaseAnonKey?.startsWith('sb_publishable_'),
  }

  // 检查环境变量
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      message: 'Supabase环境变量未配置',
      details: {
        ...details,
        missing: !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      },
    }
  }

  // 检查URL格式
  if (!details.urlFormat) {
    return {
      success: false,
      message: 'Supabase URL格式不正确',
      details: {
        ...details,
        expectedFormat: 'https://xxx.supabase.co',
        actual: supabaseUrl,
      },
    }
  }

  // 检查Key格式
  if (!details.keyFormat) {
    return {
      success: false,
      message: 'Supabase Anon Key格式不正确',
      details: {
        ...details,
        expectedFormat: 'eyJxxx...',
        actual: supabaseAnonKey?.substring(0, 20) + '...',
      },
    }
  }

  // 尝试连接
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // 测试连接
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
    
    if (error) {
      // 如果表不存在，说明Schema未执行
      if (error.message.includes('relation "user_profiles" does not exist')) {
        return {
          success: false,
          message: '数据库Schema未执行',
          details: {
            ...details,
            connection: true,
            schemaExecuted: false,
            error: error.message,
          },
        }
      }
      
      return {
        success: false,
        message: 'Supabase连接失败',
        details: {
          ...details,
          connection: false,
          error: error.message,
        },
      }
    }

    return {
      success: true,
      message: 'Supabase配置正确',
      details: {
        ...details,
        connection: true,
        schemaExecuted: true,
      },
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Supabase连接异常',
      details: {
        ...details,
        connection: false,
        error: error.message,
      },
    }
  }
}

// API路由
export async function GET() {
  const result = await checkSupabaseConfig()
  return Response.json(result)
}
