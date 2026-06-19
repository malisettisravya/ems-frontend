"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Attendance = {
date: string;
status: "PRESENT" | "LEAVE";
checkInTime?: string;
employee?: {
fullName: string;
};
};

export default function TodayAttendance() {
const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
const [selectedDate, setSelectedDate] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
const today = new Date().toISOString().split("T")[0];
setSelectedDate(today);

fetchAttendance();

}, []);

const fetchAttendance = async () => {
try {
const token = localStorage.getItem("token");


  if (!token) {
    console.error("No token found");
    return;
  }

  const res = await axios.get(
    "http://localhost:5000/attendance/all?limit=1000",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Attendance Response:", res.data);

  setAttendanceList(res.data.data || []);
} catch (error: any) {
  console.error(
    "Attendance Error:",
    error.response?.data || error.message
  );
} finally {
  setLoading(false);
}


};

const filteredAttendance = attendanceList.filter((item) => {
if (!item.date) return false;


const attendanceDate = item.date.split("T")[0];

return attendanceDate === selectedDate;


});

return ( <div className="p-6 bg-white rounded-xl shadow"> <div className="flex justify-between items-center mb-4"> <h2 className="text-lg font-semibold">
Attendance Records </h2>

    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="border rounded-lg px-3 py-2"
    />
  </div>

  <table className="w-full border border-gray-200">
    <thead>
      <tr className="bg-gray-100 border-b">
        <th className="p-2 text-left">Employee</th>
        <th className="p-2 text-left">Date</th>
        <th className="p-2 text-left">Status</th>
        <th className="p-2 text-left">Check In</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan={4} className="text-center p-4">
            Loading...
          </td>
        </tr>
      ) : filteredAttendance.length > 0 ? (
        filteredAttendance.map((emp, index) => (
          <tr key={index} className="border-b">
            <td className="p-2">
              {emp.employee?.fullName || "N/A"}
            </td>

            <td className="p-2">
              {new Date(emp.date).toLocaleDateString("en-GB")}
            </td>

            <td className="p-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  emp.status === "PRESENT"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {emp.status}
              </span>
            </td>

            <td className="p-2">
              {emp.checkInTime || "Not Checked In"}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={4}
            className="text-center p-4 text-gray-500"
          >
            No attendance records found for selected date
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


);
}
