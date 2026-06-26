// Supabase集成验证脚本
// 用于验证数据库连接和认证功能

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vzcbwzislmenrlnugmih.supabase.co'
const supabaseAnonKey = 'sb_publishable_B6hNlJ1mZHUGX8DYNSdi3Q_t1k3UHuA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabase() {
  console.log('=== Supabase集成验证 ===\n')

  // 测试1：数据库连接
  console.log('1. 测试数据库连接...')
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ 数据库连接失败:', error.message)
    } else {
      console.log('✅ 数据库连接成功')
      console.log('   用户数量:', data)
    }
  } catch (err) {
    console.log('❌ 数据库连接异常:', err)
  }

  // 测试2：表结构验证
  console.log('\n2. 验证表结构...')
  const tables = ['user_profiles', 'interview_records', 'resume_records', 'usage_limits', 'payment_records']
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ 表 ${table} 不存在或无法访问`)
      } else {
        console.log(`✅ 表 ${table} 存在`)
      }
    } catch (err) {
      console.log(`❌ 表 ${table} 检查失败`)
    }
  }

  // 测试3：认证功能
  console.log('\n3. 测试认证功能...')
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('❌ 认证服务异常:', error.message)
    } else if (session) {
      console.log('✅ 用户已登录:', session.user.email)
    } else {
      console.log('✅ 认证服务正常，用户未登录')
    }
  } catch (err) {
    console.log('❌ 认证服务异常:', err)
  }

  console.log('\n=== 验证完成 ===')
}

testSupabase()
