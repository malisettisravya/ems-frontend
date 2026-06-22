"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {toast} from 'sonner';
import { useRouter } from "next/navigation";
import { Eye, EyeOff,Mail,Lock } from "lucide-react";
 import { Users, ScanFace } from "lucide-react";

import Link from "next/link";

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
localStorage.setItem("employeeName", response.data.name);


const role = response.data.role;
const name = response.data.name;
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
  toast.success(`Welcome ${name} 👑`);
} else {
  toast.info(`Welcome ${name} 👨‍💼`);
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
    
<div className="w-full md:w-1/2 flex flex-col justify-center px-10 bg-white">
  <div className="max-w-md w-full mx-auto">

    {/* LOGO */}
    <div className="mb-4 flex justify-center">
  <img
    src="/logo.png"
    alt="Company Logo"
    className="h-28 -mb-2 object-contain drop-shadow-md"

  />
</div>

    <p className="text-1xl md:text-2xl font-semi bold text-center mb-5">
  Login to access your dashboard
</p>

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* EMAIL FIELD */}
      <div className="relative">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 pl-11 pr-3 py-3 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Mail size={18} />
        </span>
      </div>

      {/* PASSWORD FIELD */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 pl-11 pr-10 py-3 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
        />

        {/* LOCK ICON */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock size={18} />
        </span>

        {/* EYE ICON */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* FORGOT PASSWORD */}
      <div className="text-right">
        <a
          href="/forget-password"
          className="text-sm text-indigo-600 hover:underline"
        >
          Forgot Password?
        </a>
      </div>

      {/* BUTTON */}
      <button
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-medium tracking-wide"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </form>
  </div>
</div>


           

            

      {/* RIGHT SIDE */}

      {/* RIGHT SIDE */}
<div className="hidden md:flex w-1/2 relative overflow-hidden">

  {/* Background Image */}
  <img
    src="/ems1.jpeg"
    alt="login visual"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-10 w-full">

    <div className="space-y-12">

      {/* BLOCK 1 */}
      <div className="animate-slideUp flex flex-col items-center space-y-3">
        <Users className="w-10 h-10 text-white opacity-90" />
        <h3 className="text-xl font-semibold">
          Employee Management
        </h3>
        <p className="text-sm text-gray-200 max-w-xs">
          Manage employees, track performance, and handle operations efficiently.
        </p>
      </div>

      {/* BLOCK 2 */}
      <div className="animate-slideUp flex flex-col items-center space-y-3 delay-200">
        <ScanFace className="w-10 h-10 text-white opacity-90" />
        <h3 className="text-xl font-semibold">
          Smart Attendance
        </h3>
        <p className="text-sm text-gray-200 max-w-xs">
          Face recognized attendance system for secure and seamless tracking.
        </p>
      </div>

    </div>

  </div>
  </div>
  </div>
);
}