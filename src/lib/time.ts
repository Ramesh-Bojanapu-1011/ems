export function formatTime(ts: string | number | Date) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatHM(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  return `${h}h ${m}m`;
}

export function diffMinutes(startISO: string, endISO?: string) {
  const start = new Date(startISO).getTime();
  const end = endISO ? new Date(endISO).getTime() : Date.now();
  const ms = Math.max(0, end - start);
  return ms / 1000 / 60;
}

export function diffSeconds(startISO: string, endISO?: string) {
  const start = new Date(startISO).getTime();
  const end = endISO ? new Date(endISO).getTime() : Date.now();
  const ms = Math.max(0, end - start);
  return Math.floor(ms / 1000);
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export function formatHMS(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

export function isSameLocalDay(iso: string, date = new Date()) {
  const d = new Date(iso);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
}
