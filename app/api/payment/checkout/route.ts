// ============================================================
// Creem支付API路由
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createCreemClient, PRODUCTS } from '@/lib/payment/creem'

// 创建结账会话
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, customerEmail, successUrl, cancelUrl } = body

    // 验证产品ID
    const product = Object.values(PRODUCTS).find(p => p.id === productId)
    if (!product) {
      return NextResponse.json(
        { error: '无效的产品ID' },
        { status: 400 }
      )
    }

    // 创建Creem客户端
    const creem = createCreemClient()

    // 创建结账会话
    const checkout = await creem.createCheckout({
      productId: product.id,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      customerEmail,
      metadata: {
        productName: product.name,
        price: product.price.toString(),
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.checkoutUrl,
      checkoutId: checkout.id,
    })
  } catch (error: any) {
    console.error('创建结账会话失败:', error)
    return NextResponse.json(
      { error: error.message || '创建结账会话失败' },
      { status: 500 }
    )
  }
}

// 获取产品列表
export async function GET() {
  try {
    // 返回本地配置的产品列表
    const products = Object.entries(PRODUCTS).map(([key, product]) => ({
      key,
      ...product,
      priceFormatted: `$${(product.price / 100).toFixed(2)}`,
      cnyPrice: `¥${((product.price / 100) * 7.2).toFixed(2)}`,
    }))

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error: any) {
    console.error('获取产品列表失败:', error)
    return NextResponse.json(
      { error: error.message || '获取产品列表失败' },
      { status: 500 }
    )
  }
}
