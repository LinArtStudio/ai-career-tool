"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  onVerify: (token: string) => void;
}

export default function MathCaptcha({ onVerify }: Props) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("+");
  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    generate();
    // 3秒倒计时
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generate = () => {
    const ops = ["+", "-", "×"];
    const newOp = ops[Math.floor(Math.random() * ops.length)];
    let newA: number, newB: number;

    if (newOp === "×") {
      newA = Math.floor(Math.random() * 12) + 2;
      newB = Math.floor(Math.random() * 12) + 2;
    } else if (newOp === "-") {
      newA = Math.floor(Math.random() * 50) + 10;
      newB = Math.floor(Math.random() * newA);
    } else {
      newA = Math.floor(Math.random() * 50) + 10;
      newB = Math.floor(Math.random() * 50) + 10;
    }

    setA(newA); setB(newB); setOp(newOp);
    setAnswer(""); setError(""); startTime.current = Date.now();
  };

  const getCorrect = () => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    return a * b;
  };

  const check = () => {
    // 蜜罐检测：如果隐藏字段被填了，说明是机器人
    if (honeypotRef.current && honeypotRef.current.value) {
      setError("验证失败");
      generate();
      return;
    }

    // 时间检测：太快说明是机器人
    const elapsed = Date.now() - startTime.current;
    if (elapsed < 2000) {
      setError("请认真计算后再提交");
      generate();
      return;
    }

    // 次数检测：超过5次失败说明是机器人
    if (attempts >= 5) {
      setError("验证失败次数过多，请刷新页面重试");
      return;
    }

    const correct = getCorrect();
    if (parseInt(answer) === correct) {
      setVerified(true);
      setError("");
      onVerify(`${a}${op}${b}=${correct}:${Date.now()}`);
    } else {
      setAttempts((prev) => prev + 1);
      setError(`答案错误（${attempts + 1}/5）`);
      generate();
    }
  };

  if (verified) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <span className="text-green-600 text-lg">✅</span>
        <span className="text-sm text-green-700 font-medium">人机验证通过</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border rounded-lg">
      {/* 蜜罐字段 - 人眼看不见，机器人会填 */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
        aria-hidden="true"
      />

      <div className="text-sm text-gray-600 mb-3">🔒 安全验证</div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-mono font-bold bg-white px-3 py-2 rounded border">
          {a} {op} {b} = ?
        </span>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canSubmit && answer && check()}
          className="w-20 border rounded px-3 py-2 text-center text-lg"
          placeholder="?"
          disabled={!canSubmit}
        />
        <button
          onClick={check}
          disabled={!canSubmit || !answer}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {!canSubmit ? `${countdown}s` : "验证"}
        </button>
        <button onClick={generate} className="text-gray-400 hover:text-gray-600 text-lg" title="换一题">↻</button>
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
