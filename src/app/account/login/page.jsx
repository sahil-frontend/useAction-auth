"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/lib/services/auth";

const Login = () => {
  const router = useRouter();
  const [loginUser, { isLoading, isError, error, data }] =
    useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      const result = await loginUser(formData).unwrap();

      console.log("✅ Login Success:", result);

      // Redirect after successful login
      router.push("/user/profile");
    } catch (err) {
      console.error("❌ Login Failed:", err);
      setFormError(err?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <p className="mt-2 text-sm text-center text-gray-600">
            Forgot password?{" "}
            <a
              href="/account/reset-password-link"
              className="text-blue-600 hover:underline"
            >
              Reset here
            </a>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/account/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>

        {/* Server Error */}
        {formError && (
          <div className="text-red-500 text-sm mt-4 text-center">
            {formError}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
