export function toMs(value: number | string | Date): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const t = Date.parse(value);
    return Number.isNaN(t) ? Date.now() : t;
  }
  return value.getTime();
}

export function formatMsHMS(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
