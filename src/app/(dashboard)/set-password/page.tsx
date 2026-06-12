'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  /* ================= STATE ================= */
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  /* ================= TOKEN CHECK ================= */
  useEffect(() => {
    // If you DO NOT have validate API, skip and allow form
    if (!token) {
      setValid(false);
      setLoading(false);
      return;
    }

    // OPTIONAL: if you don't have validate API → just allow
    setValid(true);
    setLoading(false);
  }, [token]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // validations
    if (!token) {
      setError('Invalid or missing token');
      return;
    }

    if (password.length >= 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(
        'http://localhost:5000/admin/set-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to set password');
        return;
      }

      alert('✅ Password set successfully');

      router.push('/login');
    } catch (err) {
      console.error(err);
      setError('Server error. Check backend.');
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Validating link...
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Invalid or expired link
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h1 className="text-xl font-semibold mb-6 text-center">
          Set Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Set Password
          </button>

        </form>
      </div>
    </div>
  );
}