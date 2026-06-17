"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Attendance = {
  date: string;
  status: "PRESENT" | "LEAVE";
  checkInTime?: string; // ✅ added
  employeeId: {
    fullName: string;
  };
};


export default function TodayAttendance() {
  const [todayList, setTodayList] = useState<Attendance[]>([]);
  const [todayFormatted, setTodayFormatted] = useState("");

  // ✅ Helper function (clean & reusable)
  const formatTime = (time?: string) => {
    if (!time) return "Not Checked In";

    const date = new Date(time);
    if (isNaN(date.getTime())) return "Invalid Time";

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    // ✅ Avoid hydration mismatch
    setTodayFormatted(new Date().toLocaleDateString("en-GB"));

    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/attendance/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API DATA:", res.data); // ✅ debug

        const today = new Date().toISOString().split("T")[0];

        const filtered = res.data.data.filter((item: Attendance) => {
          return item.date?.split("T")[0] === today;
        });

        setTodayList(filtered);
      } catch (err: any) {
        console.error(
          "API ERROR:",
          err.response?.data || err.message
        );
      }
    };

    fetchAttendance();
  }, []);

  return (
    
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Today's Attendance ({todayFormatted})
      </h2>

      <table className="w-full border border-gray-200">
        <thead>
          <tr className="border-b text-left bg-gray-100">
            <th className="p-2">Employee</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Check In</th>
          </tr>
        </thead>

        <tbody>
          {todayList.length > 0 ? (
            todayList.map((emp, index) => (
              <tr key={index} className="border-b">
                {/* Employee */}
                <td className="p-2">
                  {emp.employee?.fullName }
                </td>

                {/* Date */}
                <td className="p-2">
                  {new Date(emp.date).toLocaleDateString("en-GB")}
                </td>

                {/* Status */}
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      emp.status === "PRESENT"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {emp.status === "PRESENT"
                      ? "🟢 Present"
                      : "🟡 Leave"}
                  </span>
                </td>

                {/* ✅ Check In Time */}
               <td className="p-2">
  {emp.checkInTime || "Not Checked In"}
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4} // ✅ fixed (was 3)
                className="text-center p-4 text-gray-500"
              >
                No attendance records for today
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}