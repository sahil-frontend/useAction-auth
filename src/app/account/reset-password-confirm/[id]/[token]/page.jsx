"use client";

import { useActionState, useState } from "react";
import { resetPasswordConfirmSchema } from "@/validation/schemas";
import { useParams } from "next/navigation";
import { useResetPasswordMutation } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

const ResetPasswordConfirm = () => {
  const [resetPassword] = useResetPasswordMutation();
  const router = useRouter();
  const { id, token } = useParams(); // Extracting id and token from the URL parameters
  console.log("Reset Password Confirm Page - ID:", id, "Token:", token); // Debug log

  // Reset password action function
  const resetPasswordAction = async (prevState, formData) => {
    const password = formData.get("password");
    const password_confermation = formData.get("password_confermation");

    const values = { password, password_confermation };

    // Validate using resetPasswordConfirmSchema

    try {
      await resetPasswordConfirmSchema.validate(values, { abortEarly: false });
    } catch (validationError) {
      const errors = {};
      if (validationError.inner) {
        validationError.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
      }

      return {
        errors,
        serverErrorMessage: "",
        serverSuccessMessage: "",
        success: false,
      };
    }

    try {
      const data = { ...values, id, token };
      const response = await resetPassword(data);

      if (response.data && response.data.status === "success") {
        // Redirect to login page after successful password reset
        router.push("/account/login");
        return {
          errors: {},
          serverErrorMessage: "",
          serverSuccessMessage: response.data.message,
          success: true,
        };
      }

      if (response.error && response.error.status === "failed") {
        return {
          errors: {},
          serverErrorMessage: response.error.data.message,
          serverSuccessMessage: "",
          success: false,
        };
      }
    } catch (error) {
      console.log("Error resetting password:", error);
      return {
        errors: {},
        serverErrorMessage: "An unexpected error occurred. Please try again.",
        serverSuccessMessage: "",
        success: false,
      };
    }

    return prevState;
  };

  const [state, formAction, isPending] = useActionState(resetPasswordAction, {
    errors: {},
    serverErrorMessage: "",
    serverSuccessMessage: "",
    success: false,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create new Password
        </h2>

        <form className="space-y-4" action={formAction}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confermation"
              id="password_confermation"
              placeholder="********"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.password_confermation && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.password_confermation}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>

        {state.serverSuccessMessage && (
          <div className="text-green-500 text-sm mt-2">
            {state.serverSuccessMessage}
          </div>
        )}
        {state.serverErrorMessage && (
          <div className="text-red-500 text-sm mt-2">
            {state.serverErrorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
