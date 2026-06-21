"use client";
import { useState, useEffect } from "react";

export function LoadingProgress({ message = "AI分析中", estimated = 15 }: { message?: string; estimated?: number }) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
      setProgress((p) => Math.min(p + (100 / estimated), 95));
    }, 1000);
    return () => clearInterval(interval);
  }, [estimated]);

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-sm text-gray-600">
        ⏳ {message}... {elapsed}秒
        <span className="text-gray-400 ml-2">（预计{estimated}秒）</span>
      </div>
    </div>
  );
}
