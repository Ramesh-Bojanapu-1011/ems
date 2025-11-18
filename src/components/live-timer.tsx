"use client";

import React from "react";
// import { useTick } from "@/hooks/use-tick";
// import { formatMsHMS, toMs } from "@/lib/time-format";

type LiveTimerProps = {
  // when the active session started
  start: number | string | Date;
  // previously accumulated duration in ms (e.g., earlier sessions today)
  baseMs?: number;
  // whether the timer is actively running
  running?: boolean;
  // optional label
  label?: string;
  // compact style
  size?: "sm" | "md";
};

export function LiveTimer(
  {
    // start,
    // // baseMs = 0,
    // running = true,
    // label = "Active",
    // size = "md",
  }: LiveTimerProps,
) {
  // const now = useTick({ intervalMs: 1000, paused: !running });
  // const startMs = React.useMemo(() => toMs(start), [start]);
  // const liveMs = running ? Math.max(0, now - startMs) : 0;
  // const totalMs = baseMs + liveMs;

  // const chipSize =
  //   size === "sm" ? "text-xs px-2 py-1 gap-1" : "text-sm px-3 py-1.5 gap-1.5";

  return (
    <></>
    // <div
    //   role="status"
    //   aria-live="polite"
    //   className={`inline-flex items-center rounded-full ${chipSize} font-mono
    //     bg-primary/10 text-primary`}
    //   title={`${label}: ${formatMsHMS(totalMs)}`}
    // >
    //   <span className="relative flex h-2 w-2">
    //     {running ? (
    //       <>
    //         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
    //         <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
    //       </>
    //     ) : (
    //       <span className="relative inline-flex h-2 w-2 rounded-full bg-muted-foreground/60" />
    //     )}
    //   </span>
    //   <span className="sr-only">{label}</span>
    //   <span aria-label="elapsed time">{formatMsHMS(totalMs)}</span>
    // </div>
  );
}

export default LiveTimer;
