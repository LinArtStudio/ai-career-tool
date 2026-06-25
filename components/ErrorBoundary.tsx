"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold mb-2">出了点问题</h1>
            <p className="text-gray-600 mb-4">页面遇到了错误，请尝试以下解决方案：</p>
            <ul className="text-sm text-gray-500 text-left mb-6 space-y-2">
              <li>• 刷新页面重试</li>
              <li>• 清除浏览器缓存</li>
              <li>• 检查网络连接</li>
              <li>• 使用Chrome/Edge浏览器</li>
            </ul>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                刷新页面
              </button>
              <button onClick={() => window.history.back()}
                className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50">
                返回上页
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
