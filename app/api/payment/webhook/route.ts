// ============================================================
// Creem Webhook处理 - 支付成功回调
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createCreemClient, CreemPayment } from '@/lib/payment/creem'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Webhook事件类型
interface WebhookEvent {
  id: string
  type: string
  data: {
    checkout_id: string
    customer_email: string
    product_id: string
    amount: number
    currency: string
    status: string
    metadata?: Record<string, string>
  }
  created_at: string
}

// 处理支付成功
async function handlePaymentSuccess(event: WebhookEvent) {
  const { checkout_id, customer_email, product_id, amount, currency, metadata } = event.data

  console.log('支付成功:', {
    checkoutId: checkout_id,
    email: customer_email,
    productId: product_id,
    amount,
    currency,
  })

  // 检查Supabase是否已配置
  if (!isSupabaseConfigured() || !supabase) {
    console.log('Supabase未配置，跳过数据库操作')
    return
  }

  // 查找或创建用户
  let userId: string | null = null

  // 通过邮箱查找用户
  if (customer_email) {
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', customer_email)
      .limit(1)

    if (users && users.length > 0) {
      userId = users[0].id
    }
  }

  // 如果用户不存在，创建匿名用户
  if (!userId) {
    const { data: newUser, error } = await supabase
      .from('user_profiles')
      .insert({
        email: customer_email,
        nickname: customer_email?.split('@')[0] || '用户',
        is_premium: true,
      })
      .select('id')
      .single()

    if (error) {
      console.error('创建用户失败:', error)
      throw error
    }
    userId = newUser.id
  }

  // 记录支付记录
  await supabase
    .from('payment_records')
    .insert({
      user_id: userId,
      plan_type: metadata?.productName || 'unknown',
      amount: amount / 100, // 转换为元
      payment_method: 'creem',
      status: 'approved',
      approved_at: new Date().toISOString(),
    })

  // 更新用户付费状态
  await supabase
    .from('user_profiles')
    .update({
      is_premium: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  console.log('用户付费状态已更新:', userId)
}

// 处理订阅取消
async function handleSubscriptionCancelled(event: WebhookEvent) {
  const { customer_email } = event.data

  if (customer_email && supabase) {
    // 查找用户
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', customer_email)
      .limit(1)

    if (users && users.length > 0) {
      // 可以选择是否降级用户
      // 这里我们保留付费状态，因为可能是终身会员
      console.log('订阅取消:', customer_email)
    }
  }
}

// Webhook处理主函数
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-creem-signature') || ''

    // 验证webhook签名（如果配置了webhook secret）
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
    if (webhookSecret) {
      const isValid = CreemPayment.verifyWebhookSignature(body, signature, webhookSecret)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // 解析webhook事件
    const event: WebhookEvent = JSON.parse(body)

    console.log('收到webhook事件:', event.type)

    // 根据事件类型处理
    switch (event.type) {
      case 'checkout.completed':
      case 'payment.success':
        await handlePaymentSuccess(event)
        break

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event)
        break

      default:
        console.log('未处理的事件类型:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook处理失败:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook处理失败' },
      { status: 500 }
    )
  }
}
