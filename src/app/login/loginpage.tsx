"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/auth/login", //
        formData
      );

      console.log("Login Success:", response.data);

      // Example: store token
      localStorage.setItem("token", response.data.token);

      // Example: redirect
      // router.push("/dashboard");

    } catch (err: any) {
      console.log("Login Error:", err);

      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 bg-gray-50">
        <div className="max-w-md w-full mx-auto">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            EMS Portal
          </h1>

          <p className="text-gray-500 mb-6">
            Login to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </form>

          <p className="text-sm text-gray-400 mt-6">
            Admin & Employees have different access levels
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-700"></div>

        <div className="relative z-10 max-w-md text-center space-y-8 px-6">
          <div>
            <h2 className="text-xl font-semibold">Role-Based Access</h2>
            <p className="text-sm text-gray-200">
              Admins manage employees, users access personal dashboards.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Employee Management</h2>
            <p className="text-sm text-gray-200">
              Track employee data, roles, and performance efficiently.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Secure System</h2>
            <p className="text-sm text-gray-200">
              Authentication ensures protected access to company data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}