"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ClockControls } from "@/components/clock-controls";
import { TimesheetTable } from "@/components/timesheet-table";
import { formatHM } from "@/lib/time";
import { useAuth } from "../../hooks/use-auth";
import { useTimesheets } from "../../hooks/use-timesheets";

export function EmployeeDashboard() {
  const { user } = useAuth();
  const { activeEntry, totalTodayMinutes } = useTimesheets(user?.id);

  if (!user) return null;

  const isLeave = !activeEntry && totalTodayMinutes < 480;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span className="text-pretty">Welcome, {user.name}</span>
            <div className="flex items-center gap-2">
              <Badge
                className="rounded-full"
                variant={activeEntry ? "default" : "secondary"}
              >
                {activeEntry ? "Active" : "Inactive"}
              </Badge>
              {isLeave && (
                <Badge
                  className="rounded-full"
                  variant="destructive"
                  title="Total today is below 8 hours"
                >
                  Leave
                </Badge>
              )}
            </div>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your work sessions and locations.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Today&apos;s total</p>
            <p className="text-3xl font-semibold font-mono">
              {formatHM(totalTodayMinutes)}
            </p>
          </div>
          <ClockControls />
        </CardContent>
      </Card>

      <TimesheetTable />
    </div>
  );
}
