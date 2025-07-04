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
  const [verifyEmail] = useVerfyEmailMutation();
  const router = useRouter();

  const verifyEmailAction = async (prevState, formData) => {
    const values = {
      email: formData.get("email"),
      otp: formData.get("otp"),
    };

    // Validate with schema
    try {
      await verifyEmailSchema.validate(values, { abortEarly: false });
    } catch (validationError) {
      const errors = {};
      validationError.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      return {
        ...prevState,
        errors,
        serverErrorMessage: "",
        serverSuccessMessage: "",
        loading: false,
      };
    }

    // If validation passes, proceed with API call
    try {
      const response = await verifyEmail(values);
      
      if (response.data && response.data.status === "success") {
        router.push('/account/login');
        return {
          errors: {},
          serverErrorMessage: "",
          serverSuccessMessage: response.data.message,
          loading: false,
        };
      }
      
      if (response.error && response.error.status === "failed") {
        return {
          errors: {},
          serverErrorMessage: response.error.data.message,
          serverSuccessMessage: "",
          loading: false,
        };
      }
    } catch (error) {
      console.log("Error verifying email:", error);
      return {
        errors: {},
        serverErrorMessage: "An unexpected error occurred",
        serverSuccessMessage: "",
        loading: false,
      };
    }

    return prevState;
  };

  const [state, formAction, isPending] = useActionState(verifyEmailAction, initialState);

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