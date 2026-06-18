"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function ApplyLeave() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const [totalLeaves, setTotalLeaves] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  /* ================= FETCH LEAVE BALANCE ================= */
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
      } catch (error: any) {
        console.log("BALANCE ERROR 👉", error.response?.data);
        toast.error("Failed to load leave balance");
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchLeaveBalance();
  }, []);

  /* ================= CALCULATE DAYS ================= */
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fromDate || !toDate || !reason) {
      toast.error("Please fill all fields");
      return;
    }

    if (fromDate < today || toDate < today) {
      toast.error("Past dates are not allowed");
      return;
    }

    if (toDate < fromDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/leave/apply",
        { fromDate, toDate, reason }, // ✅ no leaveType
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Leave applied successfully!");

      // Reset form
      setFromDate("");
      setToDate("");
      setReason("");
      setNumberOfDays(0);
    } catch (error: any) {
      console.log("APPLY ERROR 👉", error.response?.data);
      toast.error(error.response?.data?.message?.[0] || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
      <div className="w-[1100px] h-[550px] bg-white shadow-lg rounded-xl flex">
        
        {/* LEFT */}
        <div className="w-2/3 p-6 border-r">
          <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="flex gap-3">
              <input
                type="date"
                value={fromDate}
                min={today}
                required
                onChange={(e) => setFromDate(e.target.value)}
                className="w-1/2 border p-2 rounded"
              />

              <input
                type="date"
                value={toDate}
                min={fromDate || today}
                required
                onChange={(e) => setToDate(e.target.value)}
                className="w-1/2 border p-2 rounded"
              />
            </div>

            <input
              readOnly
              value={numberOfDays}
              className="w-full border p-2 rounded bg-gray-100"
            />

            <textarea
              value={reason}
              required
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              className="w-full border p-2 rounded"
              rows={4}
            />

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setReason("");
                  setNumberOfDays(0);
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

        {/* RIGHT */}
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