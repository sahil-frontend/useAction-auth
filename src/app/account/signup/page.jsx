"use client";
import React, { useActionState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupFormAction } from "@/action/signup";

// adjust path if needed

const SignupForm = () => {
  const [state, formAction, isPending] = useActionState(
    signupFormAction,
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.redirect) {
      router.push(state.redirect); // ✅ automatic redirect
    } else if (state?.error) {
      console.log(state.error);
    }
  }, [state?.success, state?.redirect, state?.error, router]);

  return (
    <div className="flex flex-col md:flex-row h-[80vh] overflow-hidden">
      {/* Left Image Section */}
      <div className="relative w-full md:w-1/2 h-64 md:h-full">
        <img
          src="https://cdn.pixabay.com/photo/2017/08/05/00/12/girl-2581913_1280.jpg"
          alt="Signup Visual"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center leading-snug">
            Welcome to Urban SWagger!
          </h1>
        </div>
      </div>

      {/* Right Signup Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white py-10 md:py-0">
        <div className="w-full max-w-md px-6 sm:px-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Sign Up
          </h2>
          <p className="text-gray-500 mb-6">
            Please fill in your details to create an account
          </p>

          {/* {state?.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{state.error}</p>
              </div>
            )}
            {state?.success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 text-sm">{state.message}</p>
              </div>
            )} */}

          <form action={formAction}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className={`w-full px-3 py-3 border-b ${
                  state?.errors?.name ? "border-red-400" : "border-gray-400"
                } focus:outline-none focus:border-gray-800`}
              />
              {state?.errors?.name && (
                <p className="text-sm text-red-500 mt-1">{state.errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                required
                className={`w-full px-3 py-3 border-b ${
                  state?.errors?.mobile ? "border-red-400" : "border-gray-400"
                } focus:outline-none focus:border-gray-800`}
              />
              {state?.errors?.mobile && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.mobile}
                </p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className={`w-full px-3 py-3 border-b ${
                  state?.errors?.email ? "border-red-400" : "border-gray-400"
                } focus:outline-none focus:border-gray-800`}
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div className="mb-6">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className={`w-full px-3 py-3 border-b ${
                  state?.errors?.password ? "border-red-400" : "border-gray-400"
                } focus:outline-none focus:border-gray-800`}
              />
              {state?.errors?.password && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
