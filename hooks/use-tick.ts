"use client";

import { useEffect, useRef, useState } from "react";

type UseTickOptions = {
  intervalMs?: number;
  paused?: boolean;
};

export function useTick(options: UseTickOptions = {}) {
  const { intervalMs = 1000, paused = false } = options;
  const [now, setNow] = useState<number>(() => Date.now());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    setNow(Date.now()); // sync immediately
    timerRef.current = window.setInterval(() => {
      setNow(Date.now());
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs, paused]);

  return now;
}
