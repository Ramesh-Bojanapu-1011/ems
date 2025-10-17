import useSWR, { mutate as globalMutate } from "swr";
import { isSameLocalDay, diffMinutes } from "@/lib/time";
import { getCurrentLocation, type GeoPoint } from "@/lib/location";

export type TimeEntry = {
  id: string;
  userId: string;
  dateISO: string; // clock in date
  clockIn: string; // ISO
  clockOut?: string; // ISO
  clockInLocation?: GeoPoint;
  clockOutLocation?: GeoPoint;
};


const fetcher = async (key: string) => {
  // key structure: ems.timesheets:<userId>
  const userId = key.split(":")[1] || "";
  if (!userId) return [];
  const res = await fetch(`/api/timesheets?userId=${userId}`);
  if (!res.ok) return [];
  return await res.json();
};

export function useTimesheets(userId?: string) {
  const key = userId ? `ems.timesheets:${userId}` : null;
  const { data: entries = [] } = useSWR<TimeEntry[]>(key, fetcher, {
    revalidateOnFocus: false,
  });

  const save = async (next: TimeEntry[]) => {
    if (!userId) return;
    // Save all entries for the user to MongoDB (replace all for simplicity)
    await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collection: 'timesheets',
        data: { userId, entries: next },
      }),
    });
    await globalMutate(key);
  };

  const clockIn = async () => {
    if (!userId) return;
    const now = new Date().toISOString();
    const active = entries.find((e) => !e.clockOut);
    if (active) return; // already clocked in

    const loc = await getCurrentLocation();

    const newEntry: TimeEntry = {
      id: crypto.randomUUID(),
      userId,
      dateISO: now,
      clockIn: now,
      clockInLocation: loc,
    };
    await save([newEntry, ...entries]);
  };

  const clockOut = async () => {
    if (!userId) return;
    const now = new Date().toISOString();
    const idx = entries.findIndex((e) => !e.clockOut);
    if (idx === -1) return;

    const loc = await getCurrentLocation();

    const next = [...entries];
    next[idx] = { ...next[idx], clockOut: now, clockOutLocation: loc };
    await save(next);
  };

  const activeEntry = entries.find((e) => !e.clockOut);
  const todaysEntries = entries.filter((e) =>
    isSameLocalDay(e.clockIn || e.dateISO),
  );
  const totalTodayMinutes = todaysEntries.reduce(
    (sum, e) => sum + diffMinutes(e.clockIn, e.clockOut),
    0,
  );

  return {
    entries,
    todaysEntries,
    activeEntry,
    totalTodayMinutes,
    clockIn,
    clockOut,
  };
}
