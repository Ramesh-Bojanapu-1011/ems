"use client";

import { formatTime, diffSeconds, formatHMS } from "@/lib/time";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimesheets } from "../../hooks/use-timesheets";
import { useAuth } from "../../hooks/use-auth";
import Link from "next/link";

export function TimesheetTable() {
  const { user } = useAuth();
  const { todaysEntries } = useTimesheets(user?.id);

  const totalSeconds =
    todaysEntries.length === 0
      ? 0
      : todaysEntries.reduce(
          (acc, e) => acc + diffSeconds(e.clockIn, e.clockOut),
          0,
        );

  const isLeave = totalSeconds < 8 * 60 * 60;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Link href="/locationpage" className=" ">
            get location
          </Link>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>In Location</TableHead>
                <TableHead>Out Location</TableHead>
                <TableHead className="text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysEntries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No sessions yet today.
                  </TableCell>
                </TableRow>
              ) : (
                todaysEntries.map((e) => {
                  const dur = diffSeconds(e.clockIn, e.clockOut);
                  const inLoc = e.clockInLocation
                    ? `${e.clockInLocation.lat.toFixed(
                        5,
                      )}, ${e.clockInLocation.lng.toFixed(5)}`
                    : null;
                  const outLoc = e.clockOutLocation
                    ? `${e.clockOutLocation.lat.toFixed(
                        5,
                      )}, ${e.clockOutLocation.lng.toFixed(5)}`
                    : null;

                  const inHref = inLoc
                    ? `https://www.google.com/maps?q=${
                        e.clockInLocation!.lat
                      },${e.clockInLocation!.lng}`
                    : null;
                  const outHref = outLoc
                    ? `https://www.google.com/maps?q=${
                        e.clockOutLocation!.lat
                      },${e.clockOutLocation!.lng}`
                    : null;

                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono text-sm">
                        {formatTime(e.clockIn)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {e.clockOut ? formatTime(e.clockOut) : "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {inLoc ? (
                          <a
                            href={inHref!}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-2 text-foreground/80 hover:text-foreground"
                          >
                            {inLoc}
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {outLoc ? (
                          <a
                            href={outHref!}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-2 text-foreground/80 hover:text-foreground"
                          >
                            {outLoc}
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatHMS(dur)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {todaysEntries.length > 0 && (
                <>
                  <TableRow className="font-medium">
                    <TableCell colSpan={4} className="text-right">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatHMS(totalSeconds)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-right text-muted-foreground"
                    >
                      Leave (below 8h)
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {isLeave ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
