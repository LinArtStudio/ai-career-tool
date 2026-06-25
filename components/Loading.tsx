"use client";

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
