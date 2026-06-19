"use client";

import React, { useEffect, useState } from "react";

interface LeaveRecord {
  id: string | number;
  Reason: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: "Approved" | "Rejected" | "Pending" | string;
}

export default function LeaveHistory() {
  const [leaveData, setLeaveData] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLeaveHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        // 🔴 Guard: no token = avoid useless API call
        if (!token) {
          setError("No authentication token found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/leave/my-leaves",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        // 🔴 Handle unauthorized explicitly
        if (response.status === 401) {
          setError("Session expired or unauthorized. Please login again.");
          setLeaveData([]);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();

        // ✅ You confirmed shape: { leaves: [...] }
        const leaves: LeaveRecord[] = data?.leaves ?? [];

        if (!Array.isArray(leaves)) {
          throw new Error("Invalid response format from server");
        }

        setLeaveData(leaves);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();

    return () => controller.abort();
  }, []);

  const getStatusStyles = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium";
      case "rejected":
        return "bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium";
      case "pending":
        return "bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium";
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Loading leave history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded border">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Leave History</h2>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Reason</th>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3 text-center">Days</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {leaveData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No leave records found
                </td>
              </tr>
            ) : (
              leaveData.map((leave, index) => (
                <tr key={leave.id ?? index} className="border-t">
                  <td className="p-3">{leave.reason}</td>
                  <td className="p-3">{leave.fromDate}</td>
                  <td className="p-3">{leave.toDate}</td>
                  <td className="p-3 text-center">{leave.days}</td>
                  <td className="p-3">
                    <span className={getStatusStyles(leave.status)}>
                      {leave.status}
                    </span>
                  </td>
                
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}