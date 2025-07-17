"use client";

import { useActionState, useState } from "react";
import { verifyEmailSchema } from "@/validation/schemas";

import { useRouter } from "next/navigation";
import { useVerfyEmailMutation } from "@/lib/services/auth";

const initialState = {
  errors: {},
  serverErrorMessage: "",
  serverSuccessMessage: "",
  loading: false,
};

const VerifyEmail = () => {

  const router = useRouter();



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Account</h2>
        <form className="space-y-4" action={formAction}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.email && (
              <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="number"
              name="otp"
              id="otp"
              placeholder="Enter OTP"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.otp && (
              <p className="text-red-500 text-sm mt-1">{state.errors.otp}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {state.serverSuccessMessage && (
          <div className="text-green-500 text-sm mt-4">{state.serverSuccessMessage}</div>
        )}

        {state.serverErrorMessage && (
          <div className="text-red-500 text-sm mt-4">{state.serverErrorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;