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
        { fromDate, toDate, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Leave applied successfully!");

      setFromDate("");
      setToDate("");
      setReason("");
      setNumberOfDays(0);
    } catch (error: any) {
      toast.error(error.response?.data?.message?.[0] || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center -mt-10">
  <div className="w-full max-w-[1100px] h-[480px] flex gap-4">
      
      
      {/* MAIN CONTAINER */}
       <div className="w-full max-w-[1100px] h-[480px] flex gap-4">
        {/* LEFT CARD */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">

          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Request Time Off
            </h2>
            <div className="border-b mt-2 mb-4"></div>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* DATE ROW */}
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="text-xs text-gray-500">Start Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    min={today}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="w-1/2">
                  <label className="text-xs text-gray-500">End Date</label>
                  <input
                    type="date"
                    value={toDate}
                    min={fromDate || today}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* DAYS */}
              <div>
                <label className="text-xs text-gray-500">Number of Days</label>
                <input
                  readOnly
                  value={numberOfDays}
                  className="w-full mt-1 bg-gray-100 border border-gray-200 p-2 rounded-md text-sm"
                />
              </div>

              {/* REASON */}
              <div>
                <label className="text-xs text-gray-500">Reason for Leave</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please detail the reason for your leave..."
                  rows={3}
                  className="w-full mt-1 border border-gray-300 p-2 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    setReason("");
                    setNumberOfDays(0);
                  }}
                  className="px-4 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-1.5 text-sm rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="w-[280px] bg-white rounded-xl shadow-md p-4 flex flex-col justify-center items-center">
          

          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Leave Dashboard
          </h3>

          <div className="w-[140px] h-[140px] rounded-full border-[10px] border-green-200 flex items-center justify-center relative">
            
            <div className="absolute w-[140px] h-[140px] rounded-full border-[10px] border-green-600 border-t-transparent rotate-45"></div>

            <div className="text-center">
              <p className="text-lg font-semibold">
                {balanceLoading ? "--" : `${totalLeaves} / 20`}
              </p>
              <p className="text-[10px] text-gray-500">Days</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Your Available Leave:{" "}
            <span className="font-medium text-gray-700">
              {balanceLoading ? "--" : totalLeaves} Days
            </span>
          </p>
        </div>

      </div>
    </div>
    </div>
  
  );
}