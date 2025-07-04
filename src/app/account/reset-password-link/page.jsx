"use client";

import { useActionState } from "react";
import { resetPasswordSchema } from "@/validation/schemas";
import { useResetPasswordLinkMutation } from "@/lib/services/auth";

const ResetPasswordLink = () => {
  const [resetPasswordLink] = useResetPasswordLinkMutation();

  // Reset password link action function
  const resetPasswordLinkAction = async (prevState, formData) => {
    const email = formData.get("email");
    const values = { email };

    // Validate using resetPasswordSchema
    try {
      await resetPasswordSchema.validate(values, { abortEarly: false });
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
      const response = await resetPasswordLink(values);
      
      if (response.data && response.data.status === "success") {
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
      console.log("Error sending reset password link:", error);
      return {
        errors: {},
        serverErrorMessage: "An unexpected error occurred. Please try again.",
        serverSuccessMessage: "",
        success: false,
      };
    }

    return prevState;
  };
  
  const [state, formAction, isPending] = useActionState(resetPasswordLinkAction, {
    errors: {},
    serverErrorMessage: "",
    serverSuccessMessage: "",
    success: false,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {state.serverSuccessMessage && (
          <div className="text-green-500 text-sm mt-2">{state.serverSuccessMessage}</div>
        )}
        {state.serverErrorMessage && (
          <div className="text-red-500 text-sm mt-2">{state.serverErrorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordLink;