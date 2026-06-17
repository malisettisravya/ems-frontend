"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/* ---------------- CONFIG ---------------- */
const BASE_URL = "http://localhost:5000/admin";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ---------------- TYPES ---------------- */
type Stats = {
  totalEmployees: number;
  pendingLeaves: number;
  approvedLeaves: number;
  completedTasks: number;
};

type LeaveOverview = {
  pending: number;
  approved: number;
  rejected: number;
};

type ActivityProps = {
  name: string;
  action: string;
  time: string;
};

/* ---------------- PAGE ---------------- */
export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    completedTasks: 0,
  });

  const [leaveData, setLeaveData] = useState<LeaveOverview>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [activities, setActivities] = useState<ActivityProps[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------- Fetch Data -------- */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, leaveRes] = await Promise.all([
          axios.get(`${BASE_URL}/dashboard`, getAuthHeader()),
          axios.get(`${BASE_URL}/leaves/overview`, getAuthHeader()),
        ]);

        /* -------- STATS -------- */
        const statsData = statsRes.data?.data || statsRes.data;

        setStats({
          totalEmployees: statsData.totalEmployees ?? 0,
          pendingLeaves: statsData.pendingLeaves ?? 0,
          approvedLeaves: statsData.approvedLeaves ?? 0,
          completedTasks: statsData.completedTasks ?? 0,
        });

        /* -------- LEAVE OVERVIEW -------- */
        const leaveApi = leaveRes.data?.data || leaveRes.data;

        setLeaveData({
          pending: leaveApi.pending ?? leaveApi.pendingLeaves ?? 0,
          approved: leaveApi.approved ?? leaveApi.approvedLeaves ?? 0,
          rejected: leaveApi.rejected ?? leaveApi.rejectedLeaves ?? 0,
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* -------- Date Logic -------- */
  useEffect(() => {
    function getTimeUntilMidnight() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      return midnight.getTime() - now.getTime();
    }

    function scheduleMidnightUpdate() {
      const timeout = setTimeout(() => {
        setCurrentDate(new Date());
        scheduleMidnightUpdate();
      }, getTimeUntilMidnight());

      return timeout;
    }

    const timeout = scheduleMidnightUpdate();
    return () => clearTimeout(timeout);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>

          <p className="text-gray-500 text-sm">
            Here’s what’s happening with your team today
          </p>
        </div>

        <button className="bg-white shadow px-4 py-2 rounded text-sm text-gray-600">
          {formattedDate}
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Employees" value={stats.totalEmployees} />
        <Card title="Pending Leaves" value={stats.pendingLeaves} />
        <Card title="Approved Leaves" value={stats.approvedLeaves} />
        <Card title="Completed Tasks" value={stats.completedTasks} />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Leave Overview */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-gray-700 mb-4">
            Leave Overview
          </h2>

          <div className="flex items-center justify-center h-48">
            <div className="w-36 h-36 rounded-full border-[14px] border-blue-500 border-t-green-400 border-r-red-400 border-b-gray-300" />
          </div>

          {/* ✅ FULLY DYNAMIC */}
          <div className="text-sm space-y-2 mt-4 text-gray-600">
            <p>🔵 Pending: {leaveData.pending}</p>
            <p>🟢 Approved: {leaveData.approved}</p>
            <p>🔴 Rejected: {leaveData.rejected}</p>
          </div>
        </div>

        {/* Activity Panel */}
        <div className="bg-white p-5 rounded-xl shadow md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">
              Recent Activities
            </h2>
            <button className="text-blue-500 text-sm">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((item, index) => (
                <Activity key={index} {...item} />
              ))
            ) : (
              <p className="text-gray-400 text-sm">
                No activities found
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  );
}

function Activity({ name, action, time }: ActivityProps) {
  return (
    <div className="flex justify-between items-start border-b pb-3">
      <p className="text-sm text-gray-800">
        <span className="font-semibold">{name}</span> {action}
      </p>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}