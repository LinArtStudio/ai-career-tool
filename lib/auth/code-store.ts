// 简单的内存验证码存储（生产环境应用Redis）
interface CodeEntry {
  code: string;
  expires: number;
}

const store = new Map<string, CodeEntry>();

export function saveCode(method: string, target: string, code: string): void {
  store.set(`${method}:${target}`, {
    code,
    expires: Date.now() + 5 * 60 * 1000, // 5分钟有效
  });
}

export function verifyCode(method: string, target: string, code: string): boolean {
  const entry = store.get(`${method}:${target}`);
  if (!entry) return false;
  if (entry.code !== code) return false;
  if (entry.expires < Date.now()) return false;
  store.delete(`${method}:${target}`);
  return true;
}

export function hasRecentCode(method: string, target: string): boolean {
  const entry = store.get(`${method}:${target}`);
  return entry !== undefined && entry.expires > Date.now();
}
