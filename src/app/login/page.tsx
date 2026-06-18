"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {toast} from 'sonner';
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter(); // ✅ inside component

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
  "http://localhost:5000/auth/login",
  formData
);

localStorage.setItem("token", response.data.token);

const role = response.data.role;

// ✅ Toast here
toast(
  role === "admin"
    ? "Welcome Admin "
    : "Welcome Employee"
);

// ✅ Redirect
if (role === "admin") {
  router.push("/dashboard");
} else {
  router.push("/employee/dashboard");
}
      // ✅ Proper routing based on role
      if (role === "admin") {
  toast.success("Welcome Admin 👑");
} else {
  toast.info("Welcome Employee 👨‍💼");
}
    } catch (err: any) {
      console.log("Login Error:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 bg-gray-100">
        <div className="max-w-md w-full mx-auto">

          {/* LOGO */}
          {/* LOGO + BRAND */}
<div className="mb-10 flex items-center justify-center gap-3">
  
  <h1 className="text-4xl font-semibold text-gray-800 tracking-wide">
    Ryzer
  </h1>
</div>

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

           <div className="relative w-full">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter your password"
    value={formData.password}
    onChange={handleChange}
    className="w-full border border-gray-300 p-3 pr-10 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

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

          
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 relative">

        <img
          src="/ems1.jpeg"
          alt="login visual"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex h-full w-full items-center justify-center text-center text-white px-10">

          <div>
            <h1 className="text-3xl font-bold mb-4">
              Welcome to EMS
            </h1>

            <p className="text-sm text-gray-200 max-w-sm mx-auto">
              Manage employees, track performance, and handle operations efficiently.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}