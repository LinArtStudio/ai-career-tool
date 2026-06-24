// ============================================================
// 缓存策略模块 - 减少API调用，降低成本
// ============================================================

// 缓存配置
const CACHE_CONFIG = {
  // 缓存过期时间（毫秒）
  ttl: {
    interview: 24 * 60 * 60 * 1000, // 24小时
    resume: 24 * 60 * 60 * 1000, // 24小时
    jdMatch: 12 * 60 * 60 * 1000, // 12小时
    career: 24 * 60 * 60 * 1000, // 24小时
  },
  // 最大缓存条数
  maxSize: 1000,
};

// 缓存项接口
interface CacheItem<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

// 缓存存储
const cache = new Map<string, CacheItem<any>>();

// 生成缓存键
function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join("|");
  return `${prefix}:${sortedParams}`;
}

// 获取缓存
export function getCache<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;

  // 检查是否过期
  if (Date.now() - item.timestamp > item.ttl) {
    cache.delete(key);
    return null;
  }

  // 增加命中次数
  item.hits++;
  return item.value as T;
}

// 设置缓存
export function setCache<T>(key: string, value: T, ttl: number): void {
  // 检查缓存大小
  if (cache.size >= CACHE_CONFIG.maxSize) {
    // 删除最旧的缓存
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }

  cache.set(key, {
    key,
    value,
    timestamp: Date.now(),
    ttl,
    hits: 0,
  });
}

// 删除缓存
export function deleteCache(key: string): void {
  cache.delete(key);
}

// 清空缓存
export function clearCache(): void {
  cache.clear();
}

// 获取缓存统计
export function getCacheStats(): {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
} {
  let hits = 0;
  let misses = 0;

  cache.forEach((item) => {
    hits += item.hits;
  });

  return {
    size: cache.size,
    hits,
    misses,
    hitRate: hits + misses > 0 ? hits / (hits + misses) : 0,
  };
}

// 面试问题缓存
export function getCachedInterviewQuestions(
  jobTitle: string,
  company?: string
): any | null {
  const key = generateCacheKey("interview", { jobTitle, company: company || "" });
  return getCache(key);
}

export function setCachedInterviewQuestions(
  jobTitle: string,
  company: string | undefined,
  questions: any
): void {
  const key = generateCacheKey("interview", { jobTitle, company: company || "" });
  setCache(key, questions, CACHE_CONFIG.ttl.interview);
}

// 简历诊断缓存
export function getCachedResumeAnalysis(resumeHash: string): any | null {
  const key = generateCacheKey("resume", { hash: resumeHash });
  return getCache(key);
}

export function setCachedResumeAnalysis(resumeHash: string, analysis: any): void {
  const key = generateCacheKey("resume", { hash: resumeHash });
  setCache(key, analysis, CACHE_CONFIG.ttl.resume);
}

// JD匹配缓存
export function getCachedJDMatch(resumeHash: string, jdHash: string): any | null {
  const key = generateCacheKey("jdMatch", { resume: resumeHash, jd: jdHash });
  return getCache(key);
}

export function setCachedJDMatch(
  resumeHash: string,
  jdHash: string,
  match: any
): void {
  const key = generateCacheKey("jdMatch", { resume: resumeHash, jd: jdHash });
  setCache(key, match, CACHE_CONFIG.ttl.jdMatch);
}

// 职业规划缓存
export function getCachedCareerPlan(major: string, interests: string): any | null {
  const key = generateCacheKey("career", { major, interests });
  return getCache(key);
}

export function setCachedCareerPlan(
  major: string,
  interests: string,
  plan: any
): void {
  const key = generateCacheKey("career", { major, interests });
  setCache(key, plan, CACHE_CONFIG.ttl.career);
}

// 生成内容哈希
export function generateContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}
