// ============================================================
// Creem支付集成 - 专业支付系统
// ============================================================

export interface CreemConfig {
  apiKey: string
  baseUrl?: string
}

export interface CreateCheckoutParams {
  productId: string
  successUrl: string
  cancelUrl?: string
  customerEmail?: string
  metadata?: Record<string, string>
}

export interface CheckoutSession {
  id: string
  checkoutUrl: string
  status: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingType: 'one_time' | 'recurring'
  billingPeriod?: string
}

export class CreemPayment {
  private apiKey: string
  private baseUrl: string

  constructor(config: CreemConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.creem.io/v1'
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Creem API error: ${response.status}`)
    }

    return response.json()
  }

  // 创建结账会话
  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    return this.request<CheckoutSession>('/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        product_id: params.productId,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        customer_email: params.customerEmail,
        metadata: params.metadata,
      }),
    })
  }

  // 获取产品列表
  async listProducts(): Promise<Product[]> {
    const response = await this.request<{ data: Product[] }>('/products')
    return response.data
  }

  // 获取单个产品
  async getProduct(productId: string): Promise<Product> {
    return this.request<Product>(`/products/${productId}`)
  }

  // 创建产品
  async createProduct(params: {
    name: string
    description: string
    price: number
    currency: string
    billingType: 'one_time' | 'recurring'
    billingPeriod?: string
  }): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify({
        name: params.name,
        description: params.description,
        price: params.price,
        currency: params.currency,
        billing_type: params.billingType,
        billing_period: params.billingPeriod,
      }),
    })
  }

  // 验证webhook签名
  static verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // 实现webhook签名验证
    // 具体实现取决于Creem的签名算法
    return true
  }
}

// 创建默认实例
export function createCreemClient(): CreemPayment {
  const apiKey = process.env.CREEM_API_KEY
  if (!apiKey) {
    throw new Error('CREEM_API_KEY environment variable is required')
  }

  return new CreemPayment({
    apiKey,
    baseUrl: process.env.CREEM_BASE_URL || 'https://api.creem.io/v1',
  })
}

// 产品配置
export const PRODUCTS = {
  RESUME_REWRITE: {
    id: process.env.CREEM_PRODUCT_RESUME_REWRITE || 'prod_resume_rewrite',
    name: 'AI改简历',
    price: 990, // $9.90 in cents
    currency: 'USD',
    description: '一键优化简历，AI专业改写',
  },
  RESUME_GENERATE: {
    id: process.env.CREEM_PRODUCT_RESUME_GENERATE || 'prod_resume_generate',
    name: 'AI生成简历',
    price: 1990, // $19.90 in cents
    currency: 'USD',
    description: '从零生成完整专业简历',
  },
  INTERVIEW_FULL: {
    id: process.env.CREEM_PRODUCT_INTERVIEW_FULL || 'prod_interview_full',
    name: 'AI模拟面试',
    price: 1990, // $19.90 in cents
    currency: 'USD',
    description: '5道定制题+评分+面试官视角',
  },
  COVER_LETTER: {
    id: process.env.CREEM_PRODUCT_COVER_LETTER || 'prod_cover_letter',
    name: 'AI求职信',
    price: 990, // $9.90 in cents
    currency: 'USD',
    description: '基于简历+JD定制求职信',
  },
  SPRINT_WEEKLY: {
    id: process.env.CREEM_PRODUCT_SPRINT_WEEKLY || 'prod_sprint_weekly',
    name: '冲刺卡-周卡',
    price: 1990, // $19.90 in cents
    currency: 'USD',
    description: '全功能无限使用7天',
    billingType: 'recurring',
    billingPeriod: 'weekly',
  },
  SPRINT_MONTHLY: {
    id: process.env.CREEM_PRODUCT_SPRINT_MONTHLY || 'prod_sprint_monthly',
    name: '冲刺卡-月卡',
    price: 3990, // $39.90 in cents
    currency: 'USD',
    description: '全功能无限使用30天',
    billingType: 'recurring',
    billingPeriod: 'monthly',
  },
  SPRINT_QUARTERLY: {
    id: process.env.CREEM_PRODUCT_SPRINT_QUARTERLY || 'prod_sprint_quarterly',
    name: '冲刺卡-季卡',
    price: 7990, // $79.90 in cents
    currency: 'USD',
    description: '全功能无限使用90天',
    billingType: 'recurring',
    billingPeriod: 'quarterly',
  },
  LIFETIME: {
    id: process.env.CREEM_PRODUCT_LIFETIME || 'prod_lifetime',
    name: '终身会员',
    price: 12800, // $128.00 in cents
    currency: 'USD',
    description: '一次付费，永久使用所有功能',
  },
} as const

// 获取产品价格（格式化显示）
export function formatPrice(priceInCents: number, currency: string = 'USD'): string {
  const price = priceInCents / 100
  if (currency === 'USD') {
    return `$${price.toFixed(2)}`
  }
  if (currency === 'CNY') {
    return `¥${price.toFixed(2)}`
  }
  return `${price.toFixed(2)} ${currency}`
}

// 获取人民币价格（假设汇率1:7.2）
export function getCNYPrice(usdCents: number): number {
  const usd = usdCents / 100
  const cny = usd * 7.2
  return Math.round(cny * 100) / 100
}
