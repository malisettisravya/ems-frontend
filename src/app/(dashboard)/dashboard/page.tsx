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
        

        const statsData = statsRes.data?.data || statsRes.data;

        setStats({
          totalEmployees: statsData.totalEmployees ?? 0,
          pendingLeaves: statsData.pendingLeaves ?? 0,
          approvedLeaves: statsData.approvedLeaves ?? 0,
          completedTasks: statsData.completedTasks ?? 0,
        });

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
    <div className="min-h-screen p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-gray-900 text-xl">
            Here’s what’s happening with your team today
          </p>
        </div>

        <button className="bg-white shadow px-4 py-2 rounded text-l text-black">
          {formattedDate}
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <Card title="Total Employees" value={stats.totalEmployees} color="bg-blue-500/10 border border-blue-100" />
        <Card title="Pending Leaves" value={stats.pendingLeaves} color="bg-yellow-500/10 border border-yellow-100"/>
        <Card title="Approved Leaves" value={stats.approvedLeaves} color="bg-green-500/10 border border-green-100"/>
        <Card title="Completed Tasks" value={stats.completedTasks} color="bg-purple-500/10 border border-purple-100" />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Leave Overview */}
        <div className=" p-5 rounded-xl shadow">
          <h2 className="font-semibold text-slate-900 mb-4">
            Leave Overview
          </h2>

          <div className="flex items-center justify-center h-48">
            <div className="w-36 h-36 rounded-full border-[14px] border-blue-500 border-t-green-400 border-r-red-400 border-b-gray-300" />
          </div>

          <div className="text-sm space-y-2 mt-4 text-gray-600">
            <p>🔵 Pending: {leaveData.pending}</p>
            <p>🟢 Approved: {leaveData.approved}</p>
            <p>🔴 Rejected: {leaveData.rejected}</p>
          </div>
        </div>

        {/* Image Panel (ONLY IMAGE as you wanted) */}
        <div className=" p-5 rounded-xl  md:col-span-2">
          <div className="flex justify-center items-center h-72">
            
            <img
              src="/admind.png"
              alt="Admin Activity"
              className="w-[480px] opacity-90 animate-float hover:scale-105 transition duration-300"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Card({ title, value, color }: any) {
  return (
    <div className={`p-7 rounded-xl shadow  ${color}`}>
      <div className="flex flex-col justify-start -mt-1">
        <p className="text-gray-900 text-l font-medium mb-4">{title}</p>
        <h3 className="text-2xl font-bold text-black">{value}</h3>
      </div>
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