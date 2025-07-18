"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useLoginUserMutation,
  useGoogleLoginMutation,
} from "@/lib/services/auth";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (formError) {
      toast.error(formError);
    }
  }, [formError]);

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
      // Store user data in localStorage
      if (result?.data?.user) {
        localStorage.setItem("user", JSON.stringify(result.data.user));
        window.dispatchEvent(new Event("auth-changed")); // Notify Navbar
      }
      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/user/profile");
      }, 1000);
    } catch (err) {
      console.error("❌ Login Failed:", err);
      setFormError(err?.data?.message || "Login failed.");
    }
  };

  const handleGoogleLogin = async (response) => {
    const idToken = response.credential;
    try {
      const result = await googleLogin(idToken).unwrap();
      console.log("Google login result:", result); // Debug log
      if (result.success === true) {
        // Store user data in localStorage for Google login
        if (result?.data?.user) {
          localStorage.setItem("user", JSON.stringify(result.data.user));
          window.dispatchEvent(new Event("auth-changed")); // Notify Navbar
        }
        toast.success("Google login successful!");
        setTimeout(() => {
          router.push("/user/profile");
        }, 1000);
      } else {
        setFormError(result.message || "Google login failed");
      }
    } catch (err) {
      setFormError(err?.data?.message || "Google login failed");
    }
  };
  console.log("login user response state");
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Google Script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id:
                "437522982178-84ncp1sndpp18m3v0sstn6pavpiblb08.apps.googleusercontent.com",
              callback: handleGoogleLogin,
            });

            window.google.accounts.id.renderButton(
              document.getElementById("googleLoginDiv"),
              {
                theme: "outline",
                size: "large",
                width: "100%",
              }
            );
          }
        }}
      />

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

          {/* Google Login Button */}
          <div className="mt-6">
            <div id="googleLoginDiv" className="w-full flex justify-center" />
          </div>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/account/signup"
              className="text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>

          {/* Optionally keep the inline error message */}
          {formError && (
            <div className="text-red-500 text-sm mt-4 text-center">
              {formError}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
