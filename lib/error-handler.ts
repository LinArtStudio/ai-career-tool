// ============================================================
// 错误处理工具
// ============================================================

export interface AppError {
  code: string;
  message: string;
  suggestion?: string;
}

// 错误码映射
const ERROR_MAP: Record<string, AppError> = {
  // 网络错误
  NETWORK_ERROR: {
    code: "NETWORK_ERROR",
    message: "网络连接失败",
    suggestion: "请检查网络连接后重试",
  },
  TIMEOUT: {
    code: "TIMEOUT",
    message: "请求超时",
    suggestion: "请缩短内容后重试，或稍后再试",
  },
  // API错误
  API_ERROR: {
    code: "API_ERROR",
    message: "服务暂时不可用",
    suggestion: "请稍后再试",
  },
  RATE_LIMIT: {
    code: "RATE_LIMIT",
    message: "请求过于频繁",
    suggestion: "请稍后再试",
  },
  // 输入错误
  INVALID_INPUT: {
    code: "INVALID_INPUT",
    message: "输入内容不符合要求",
    suggestion: "请检查输入内容",
  },
  TOO_SHORT: {
    code: "TOO_SHORT",
    message: "内容过短",
    suggestion: "请提供更多详细信息",
  },
  TOO_LONG: {
    code: "TOO_LONG",
    message: "内容过长",
    suggestion: "请精简内容后重试",
  },
  // 认证错误
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "请先登录",
    suggestion: "登录后即可使用此功能",
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "没有权限执行此操作",
    suggestion: "请联系客服",
  },
  // 支付错误
  PAYMENT_FAILED: {
    code: "PAYMENT_FAILED",
    message: "支付失败",
    suggestion: "请重试或联系客服",
  },
  PAYMENT_CANCELLED: {
    code: "PAYMENT_CANCELLED",
    message: "支付已取消",
    suggestion: "如需购买，请重新操作",
  },
  // 默认
  UNKNOWN: {
    code: "UNKNOWN",
    message: "操作失败",
    suggestion: "请稍后再试",
  },
};

// 获取友好的错误信息
export function getFriendlyError(error: unknown): AppError {
  if (typeof error === "string") {
    // 根据错误字符串匹配
    if (error.includes("timeout") || error.includes("超时")) {
      return ERROR_MAP.TIMEOUT;
    }
    if (error.includes("network") || error.includes("网络")) {
      return ERROR_MAP.NETWORK_ERROR;
    }
    if (error.includes("unauthorized") || error.includes("登录")) {
      return ERROR_MAP.UNAUTHORIZED;
    }
    if (error.includes("rate limit") || error.includes("频繁")) {
      return ERROR_MAP.RATE_LIMIT;
    }
    return {
      code: "UNKNOWN",
      message: error,
      suggestion: "请稍后再试",
    };
  }

  if (error instanceof Error) {
    return getFriendlyError(error.message);
  }

  return ERROR_MAP.UNKNOWN;
}

// 显示错误提示
export function showError(error: unknown): void {
  const friendlyError = getFriendlyError(error);
  const message = friendlyError.suggestion
    ? `${friendlyError.message}\n${friendlyError.suggestion}`
    : friendlyError.message;
  alert(message);
}

// 输入验证
export function validateInput(
  text: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): string | null {
  const { minLength = 0, maxLength = 10000, required = true } = options;

  if (required && (!text || text.trim().length === 0)) {
    return "内容不能为空";
  }

  if (text && text.trim().length < minLength) {
    return `内容过短，请至少输入${minLength}个字符`;
  }

  if (text && text.length > maxLength) {
    return `内容过长，请精简到${maxLength}字以内`;
  }

  return null;
}
