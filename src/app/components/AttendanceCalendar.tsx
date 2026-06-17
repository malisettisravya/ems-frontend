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

        const res = api.get(
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

  const firstDay =
    (new Date(year, month - 1, 1).getDay() + 6) % 7;

  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-6 shadow-sm tracking-tight">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-xl text-gray-900">
            {today.toLocaleString("default", { month: "long" })} {year}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">My Attendance Logs</p>
        </div>
      </div>

      {/* Week Days Headers */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day, index) => {
          if (!day) return <div key={index} className="aspect-square"></div>;

          const status = attendanceMap[day];

          const isToday =
            day === today.getDate() &&
            month === today.getMonth() + 1 &&
            year === today.getFullYear();

          // Define dynamic status layouts with refined design tokens
          let statusClasses = "text-gray-700 hover:bg-gray-50";
          let dotColor = "";

          if (status === "present") {
            statusClasses = "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100";
            dotColor = "bg-emerald-500";
          } else if (status === "leave") {
            statusClasses = "bg-rose-50 text-rose-700 font-semibold border border-rose-100";
            dotColor = "bg-rose-500";
          }

          // Accent ring layout for the current day
          const todayClasses = isToday 
            ? "ring-2 ring-indigo-500 ring-offset-2 z-10 shadow-sm" 
            : "";

          return (
            <div
              key={index}
              className={`aspect-square flex flex-col items-center justify-center relative rounded-xl transition-all duration-200 text-sm ${statusClasses} ${todayClasses}`}
            >
              <span>{day}</span>
              {dotColor && (
                <span className={`w-1.5 h-1.5 ${dotColor} rounded-full absolute bottom-2`}></span>
              )}
            </div>
          );
        })}
      </div>

      {/* Modern Compact Legend */}
      <div className="flex gap-4 mt-6 pt-5 border-t border-gray-100 justify-start text-xs font-medium text-gray-500">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span>Present</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-100">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          <span>Leave</span>
        </div>
      </div>
    </div>
  );
}