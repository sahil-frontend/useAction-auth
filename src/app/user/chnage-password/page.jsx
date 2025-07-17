"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "@/action/changePasswordAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [state, formAction, isPending] = useActionState(changePasswordAction, {
    errors: {},
    serverErrorMessage: "",
    serverSuccessMessage: "",
    success: false,
  });
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // Show toast notifications for error and success messages
  useEffect(() => {
    if (state?.serverErrorMessage) {
      toast.error(state.serverErrorMessage);
    }
    if (state?.serverSuccessMessage) {
      toast.success(state.serverSuccessMessage);
    }
  }, [state?.serverErrorMessage, state?.serverSuccessMessage]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthChecked(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (state?.success && state?.redirect) {
      // Add a small delay to show success message before redirect
      setTimeout(() => {
        router.push(state.redirect);
      }, 1500);
    }
  }, [state?.success, state?.redirect, router]);

  // Handle authentication errors
  useEffect(() => {
    if (state?.serverErrorMessage?.includes("Authentication failed")) {
      // Redirect to login after showing error briefly
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [state?.serverErrorMessage, router]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("Current state:", state);
  }, [state]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
        {/* Show success message at the top */}
        {state?.serverSuccessMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
            {state.serverSuccessMessage}
          </div>
        )}
        {/* Show error message at the top */}
        {state?.serverErrorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {state.serverErrorMessage}
            {state.serverErrorMessage.includes("Authentication failed") && (
              <p className="mt-2 text-sm">Redirecting to login...</p>
            )}
          </div>
        )}
        <form className="space-y-4" action={formAction}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter new password"
              className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isPending}
              minLength={6}
              required
            />
            {state?.errors?.password && (
              <p className="text-red-500 text-sm mt-1">
                {Array.isArray(state.errors.password)
                  ? state.errors.password.join(", ")
                  : state.errors.password}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              placeholder="Confirm new password"
              className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.password_confirmation
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              disabled={isPending}
              minLength={6}
              required
            />
            {state?.errors?.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {Array.isArray(state.errors.password_confirmation)
                  ? state.errors.password_confirmation.join(", ")
                  : state.errors.password_confirmation}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "Changing Password..." : "Change Password"}
          </button>
        </form>
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <strong>Debug Info:</strong>
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
