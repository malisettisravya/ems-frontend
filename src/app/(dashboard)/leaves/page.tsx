"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "sonner";

const BASE_URL = "http://localhost:5000/leave/admin";

/* ---------------- AUTH HEADER ---------------- */
const getAuthHeader = () => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ---------------- TYPES ---------------- */
type EmployeeDetails = {
  email?: string;
  role?: string;
};

type Leave = {
  _id: string;
  reason?: string;
  fromDate?: string;
  toDate?: string;
  Leavestatus?: string;
  adminComment?: string;
  employeeDetails?: EmployeeDetails;
};

export default function LeaveRequestsPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("all");

  /* ---------------- FETCH LEAVES ---------------- */
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`, getAuthHeader());

      const leavesData: Leave[] =
        res.data?.data || res.data?.leaves || res.data || [];

      console.log("API RESPONSE:", res.data);

      setLeaves(Array.isArray(leavesData) ? leavesData : []);
    } catch (err: any) {
      console.error("Fetch error:", err);

      if (err.response?.status === 403) {
    
        toast.error("Access denied:Admin only");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await axios.put(
        `${BASE_URL}/${id}/status`,
        { Leavestatus: status },
        getAuthHeader()
      );

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id
            ? { ...leave, Leavestatus: status }
            : leave
        )
      );
    } catch (err: any) {
      console.error("Update error:", err);

      if (err.response?.status === 403) {
        toast.error("Only admin can update status");
      }
    }
  };

  /* ---------------- FORMAT DATE ---------------- */
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  /* ---------------- STATUS STYLE ---------------- */
  const getStatusStyle = (status?: string) => {
    const s = status?.toLowerCase() || "";

    switch (s) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredLeaves = leaves.filter((leave) => {
    const status = leave.Leavestatus?.toLowerCase() || "";

    const matchesTab =
      activeTab === "all" || status === activeTab;

    const email = leave.employeeDetails?.email || "";

    const matchesSearch = email
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>

      {/* ---------------- TABS ---------------- */}
      <div className="flex gap-4 mb-4">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(
                tab as "all" | "pending" | "approved" | "rejected"
              )
            }
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />

        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Leave Types</option>
          <option value="sick">Sick Leave</option>
          <option value="casual">Casual Leave</option>
        </select>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">From</th>
                <th className="p-3">To</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave._id} className="border-t">
                  <td className="p-3">
                    {leave.employeeDetails?.email || "-"}
                  </td>

                  <td className="p-3">{leave.reason || "-"}</td>

                  <td className="p-3">
                    {formatDate(leave.fromDate)}
                  </td>

                  <td className="p-3">
                    {formatDate(leave.toDate)}
                  </td>

                  <td className="p-3">{leave.reason || "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusStyle(
                        leave.Leavestatus
                      )}`}
                    >
                      {leave.Leavestatus || "pending"}
                    </span>
                  </td>

                  <button
  type="button"
  onClick={() => updateStatus(leave._id, "approved")}
  disabled={leave.Leavestatus === "approved"}
  className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-40"
>
  ✓
</button>

<button
  type="button"
  onClick={() => updateStatus(leave._id, "reject")}
  disabled={leave.Leavestatus === "reject"}
  className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-40"
>
  ✕
</button>
                </tr>
              ))}

              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    No leave requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}