"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Loading Context
interface LoadingContextType {
  isLoading: boolean;
  message: string;
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  message: "处理中...",
  showLoading: () => {},
  hideLoading: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("处理中...");

  const showLoading = (msg = "处理中...") => {
    setIsLoading(true);
    setMessage(msg);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, message, showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

// 独立的Loading组件
interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

export function LoadingOverlay({ show, message = "处理中..." }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 text-center shadow-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function LoadingButton({ loading, children, onClick, className = "", disabled = false }: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${className} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⏳</span>
          处理中...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
