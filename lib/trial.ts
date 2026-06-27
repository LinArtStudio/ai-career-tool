// 试用期工具函数

// 试用期配置
const TRIAL_DURATION_DAYS = 3;
const TRIAL_STORAGE_KEY = 'trial-status';

// 试用期状态接口
export interface TrialStatus {
  isActive: boolean;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

// 获取试用期状态
export function getTrialStatus(): TrialStatus {
  if (typeof window === 'undefined') {
    return { isActive: false, startDate: '', endDate: '', daysRemaining: 0 };
  }
  
  try {
    const saved = localStorage.getItem(TRIAL_STORAGE_KEY);
    if (saved) {
      const status = JSON.parse(saved);
      const now = new Date();
      const endDate = new Date(status.endDate);
      
      if (now < endDate) {
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { ...status, isActive: true, daysRemaining };
      } else {
        return { ...status, isActive: false, daysRemaining: 0 };
      }
    }
    
    // 首次访问，开始试用期
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + TRIAL_DURATION_DAYS);
    
    const newStatus: TrialStatus = {
      isActive: true,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      daysRemaining: TRIAL_DURATION_DAYS
    };
    
    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(newStatus));
    return newStatus;
  } catch {
    return { isActive: false, startDate: '', endDate: '', daysRemaining: 0 };
  }
}

// 检查功能是否可用
export function isFeatureAvailable(): boolean {
  const status = getTrialStatus();
  return status.isActive;
}

// 获取试用期提示信息
export function getTrialMessage(): string {
  const status = getTrialStatus();
  
  if (status.isActive) {
    return `试用期剩余 ${status.daysRemaining} 天`;
  } else {
    return '试用期已结束，请升级获取完整功能';
  }
}
