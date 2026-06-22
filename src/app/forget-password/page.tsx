"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(""); // ONLY for testing
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email }
      );

      alert("Reset link sent to your email ✅");
       setEmail("");

      if (res.data.token) {
        setToken(res.data.token);
      }
    } catch (err) {
      console.error(err);
      alert("Error sending reset link ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4 font-semibold">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

    </div>
  );
}