 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 

interface AttendanceRecord {
  _id: string;
  userId: string;
  entries: AttendanceEntry[];
}

interface AttendanceEntry {
  id: string;
  userId: string;
  dateISO: string;
  clockIn: string;
  clockInLocation?: LocationData;
  clockOut?: string;
  clockOutLocation?: LocationData;
}

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
}

export function AdminDashboard() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const res = await fetch("/api/all-timesheets");
      const json = await res.json();
      console.log("Fetched all timesheets:", json);
      setData(json);
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Helper to calculate total login time in minutes for an employee
  function getTotalMinutes(entries: AttendanceEntry[]): number {
    return entries.reduce((sum, e) => {
      if (e.clockIn && e.clockOut) {
        const inTime = new Date(e.clockIn).getTime();
        const outTime = new Date(e.clockOut).getTime();
        if (!isNaN(inTime) && !isNaN(outTime)) {
          return sum + Math.max(0, (outTime - inTime) / 60000);
        }
      }
      return sum;
    }, 0);
  }

  // Helper to format minutes as HH:MM
  function formatHM(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Employee Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : data.length === 0 ? (
          <div>No activity found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Total Login Time</th>
                  <th>Name</th>
                  <th>Entries</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => {
                   
                  return (
                    <tr key={row._id}>
                      <td>{row._id}</td>
                      <td>{formatHM(getTotalMinutes(row.entries))}</td>
                      <td>{row.userId}</td>
                      <td>
                        {row.entries && row.entries.length > 0 ? (
                          <ul>
                            {row.entries.map((e: any) => (
                              <li key={e.id}>
                                {e.clockIn} - {e.clockOut || "Active"}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No entries"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
