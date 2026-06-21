"use client";
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

interface Toast { id: string; message: string; type: "success" | "error" | "info"; }
interface ToastContextType { addToast: (message: string, type?: Toast["type"]) => void; }

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white animate-fade-in ${
              t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-blue-600"
            }`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
