"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

export default function AttendanceCalendar() {
  const [attendance, setAttendance] = useState<any[]>([]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("TOKEN =>", token);

        const res = await api.get(
          `/attendance/monthly?month=${month}&year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Attendance Response:", res.data);
        setAttendance(res.data.calendar || []);
      } catch (error) {
        console.error("Attendance fetch error:", error);
      }
    };

    fetchAttendance();
  }, [month, year]);

  const attendanceMap = useMemo(() => {
    const map: Record<number, string> = {};
    attendance.forEach((item) => {
      map[item.day] = item.status.toLowerCase();
    });
    return map;
  }, [attendance]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = (new Date(year, month - 1, 1).getDay() + 6) % 7;

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header - Scaled down text size */}
      <h2 className="font-bold text-lg text-gray-800 mb-4 text-center">
        My Attendance (
        {today.toLocaleString("default", { month: "short" })} {year})
      </h2>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center font-semibold text-xs text-gray-400 mb-2">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {days.map((day, index) => {
          if (!day) return <div key={index}></div>;

          const status = attendanceMap[day];
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() + 1 &&
            year === today.getFullYear();

          return (
            <div
              key={index}
              className={`relative flex flex-col items-center justify-center aspect-square rounded-lg transition-colors cursor-default select-none ${
                isToday
                  ? "bg-indigo-50 border border-indigo-300 font-bold text-indigo-600"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* Day Number */}
              <span
                className={`text-xs ${
                  status === "present"
                    ? "text-green-600 font-semibold"
                    : status === "leave"
                    ? "text-red-500 font-semibold"
                    : isToday 
                    ? "text-indigo-600" 
                    : "text-gray-700"
                }`}
              >
                {day}
              </span>

              {/* Status Dot */}
              {status === "present" && (
                <span className="w-1 h-1 bg-green-500 rounded-full absolute bottom-1"></span>
              )}
              {status === "leave" && (
                <span className="w-1 h-1 bg-red-500 rounded-full absolute bottom-1"></span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          <span>Leave</span>
        </div>
      </div>
    </div>
  );
}