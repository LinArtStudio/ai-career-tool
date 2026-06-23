// ============================================================
// Sentry错误监控配置
// ============================================================

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // 采样率
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 环境
  environment: process.env.NODE_ENV || 'development',
  
  // 调试模式
  debug: process.env.NODE_ENV !== 'production',
  
  // 错误过滤
  beforeSend(event) {
    // 过滤掉某些不需要上报的错误
    if (event.exception) {
      const error = event.exception.values?.[0]
      if (error) {
        // 忽略网络错误
        if (error.type === 'NetworkError' || error.value?.includes('fetch')) {
          return null
        }
        // 忽略取消的请求
        if (error.value?.includes('cancelled') || error.value?.includes('aborted')) {
          return null
        }
      }
    }
    return event
  },
  
  // 集成配置
  integrations: [
    // 性能监控
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'ai-career-tool.vercel.app'],
    }),
  ],
  
  // 发布版本
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
})

// 自定义错误上报
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    Sentry.captureException(error)
  })
}

// 自定义消息上报
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level)
}

// 用户信息设置
export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user)
}

// 清除用户信息
export function clearUser() {
  Sentry.setUser(null)
}

// 性能监控
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({ name, op })
}

// 面包屑记录
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  })
}
