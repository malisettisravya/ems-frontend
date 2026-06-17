"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import {toast} from "sonner";

interface LeaveRequestPayload {
  reason: string;
  fromDate: string;
  toDate: string;
  leaveType: string;
}

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const [totalLeaves, setTotalLeaves] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/leave/leave-balance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTotalLeaves(response.data.totalLeaves ?? 0);
      } catch (error) {
        console.error(error);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchLeaveBalance();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      const diff =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

      setNumberOfDays(diff > 0 ? diff : 0);
    } else {
      setNumberOfDays(0);
    }
  }, [fromDate, toDate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/leave/apply",
      { leaveType, fromDate, toDate, reason },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Leave applied!");
  };

  return (
    // ✅ NO SCROLL PAGE
    <div className="h-screen bg-gray-50 flex items-center justify-center overflow-hidden">

      {/* MAIN CARD */}
      <div className="w-[1100px] h-[550px] bg-white shadow-lg rounded-xl flex">

        {/* LEFT SIDE */}
        <div className="w-2/3 p-6 border-r">
          <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Leave Type */}
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Paid Leave</option>
              <option>Unpaid Leave</option>
            </select>

            {/* Dates */}
            <div className="flex gap-3">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-1/2 border p-2 rounded"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-1/2 border p-2 rounded"
              />
            </div>

            {/* Days */}
            <input
              readOnly
              value={numberOfDays}
              className="w-full border p-2 rounded bg-gray-100"
            />

            {/* Reason */}
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-2 rounded"
              rows={4}
            />

            {/* BUTTONS (BLUE FIXED) */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setReason("");
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE (FIXED 400px CARD) */}
        <div className="w-1/3 p-6 flex items-start">
          <div className="w-full h-[400px] bg-gray-100 rounded-xl p-5 flex flex-col justify-center">
            <h3 className="font-bold mb-4">Leave Balance</h3>

            {balanceLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div className="flex justify-between">
                <span>Total Leaves</span>
                <span className="font-semibold">{totalLeaves} Days</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}