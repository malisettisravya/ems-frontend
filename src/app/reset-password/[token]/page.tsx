"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const params = useParams();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = params.token;

    try {
      await axios.post(
        `http://localhost:5000/auth/reset-password/${token}`,
        {
          password,
        }
      );

      alert("Password updated successfully ✅");

      router.push("/login");
    } catch (err) {
      alert("Invalid or expired token ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20">
      <h2 className="text-xl mb-4">Reset Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full bg-green-600 text-white p-2 rounded">
        Update Password
      </button>
    </form>
  );
}