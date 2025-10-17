/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";

import { diffMinutes, diffSeconds, formatHMS } from "@/lib/time";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { useTimesheets } from "../../hooks/use-timesheets";
import { useInterval } from "../../hooks/use-interval";

export function ClockControls() {
  const { user } = useAuth();
  const { activeEntry, clockIn, clockOut } = useTimesheets(user?.id);
  const [tick, setTick] = useState(0);

  useInterval(
    () => {
      if (activeEntry) setTick((t) => t + 1);
    },
    activeEntry ? 1000 : null,
  );

  const activeSeconds = useMemo(() => {
    if (!activeEntry) return 0;
    return diffSeconds(activeEntry.clockIn);
  }, [activeEntry, tick]);

  return (
    <div className="flex items-center gap-3">
      <Button onClick={clockIn} disabled={!!activeEntry}>
        Clock In
      </Button>
      <Button onClick={clockOut} variant="destructive" disabled={!activeEntry}>
        Clock Out
      </Button>
      <span
        className="text-xs font-mono px-2 py-1 rounded-md bg-secondary text-secondary-foreground border"
        aria-live="polite"
      >
        {activeEntry ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-primary animate-pulse"
              aria-hidden="true"
            />
            Current: {formatHMS(activeSeconds)}
          </span>
        ) : (
          "No active session"
        )}
      </span>
    </div>
  );
}
