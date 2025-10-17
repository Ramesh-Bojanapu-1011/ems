// Simple, safe localStorage helpers for Next.js runtime

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

const canUseDOM =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function getItem<T = Json>(key: string, fallback: T): T {
  if (!canUseDOM) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T = Json>(key: string, value: T) {
  if (!canUseDOM) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op
  }
}

export function removeItem(key: string) {
  if (!canUseDOM) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
}
