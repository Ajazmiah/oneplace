// app/signup/page.tsx
"use client";

import { useState } from "react";
import { signup } from "../../lib/actions/signupAction"; // server action
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      // redirect or show success
      console.log("RESULT", result);
      window.location.href = "/signin";
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full p-8 shadow-xl rounded-2xl border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#0bbcaa]">
          Resumind Signup
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]"
          />
          <button
            type="submit"
            className="w-full bg-[#0bbcaa] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-gray-700 hover:text-black font-medium underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
