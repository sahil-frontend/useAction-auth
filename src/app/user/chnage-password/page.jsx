"use client";

import { useActionState, useState } from "react";
import { changePasswordSchema } from "@/validation/schemas";
import { useRouter } from "next/navigation";
import { useChangePasswordMutation } from "@/lib/services/auth";

const initialState = {
  errors: {},
  serverErrorMessage: "",
  serverSuccessMessage: "",
  loading: false,
};

const ChangePassword = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();

  const changePasswordAction = async (prevState, formData) => {
    const values = {
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    };

    // Validate with schema
    try {
      await changePasswordSchema.validate(values, { abortEarly: false });
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
      const response = await changePassword(values);
      
      if (response.data && response.data.status === "success") {
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
      console.log("Error changing password:", error);
      return {
        errors: {},
        serverErrorMessage: "An unexpected error occurred",
        serverSuccessMessage: "",
        loading: false,
      };
    }

    return prevState;
  };

  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
        <form className="space-y-4" action={formAction}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.password && (
              <p className="text-red-500 text-sm mt-1">{state.errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              placeholder="********"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.password_confirmation}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={isPending}
          >
            {isPending ? "Changing Password..." : "Change Password"}
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

export default ChangePassword;