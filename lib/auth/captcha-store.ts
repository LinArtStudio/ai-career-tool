interface CaptchaEntry {
  answer: number;
  expires: number;
}

const store = new Map<string, CaptchaEntry>();

export function generateCaptcha(): { question: string; token: string } {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  
  let answer: number;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;

  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  
  store.set(token, {
    answer,
    expires: Date.now() + 5 * 60 * 1000,
  });

  return {
    question: `${a} ${op} ${b} = ?`,
    token,
  };
}

export function verifyCaptcha(token: string, userAnswer: number): boolean {
  const entry = store.get(token);
  if (!entry) return false;
  if (entry.expires < Date.now()) {
    store.delete(token);
    return false;
  }
  const valid = entry.answer === userAnswer;
  store.delete(token);
  return valid;
}
