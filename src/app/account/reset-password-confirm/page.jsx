"use client";

import { resetPasswordAction } from "@/action/resetPasswordAction";
import { useSearchParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordConfirm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Check if we're coming from the previous step (you might want to use sessionStorage here)
      const storedEmail = sessionStorage.getItem("resetEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        router.push("/account/login");
        toast.error("No email provided");
      }
    }
  }, [searchParams, router]);

  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    null
  );

  // Show toast notifications based on state
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Password reset successful");
      setTimeout(() => {
        // Clean up stored email
        sessionStorage.removeItem("resetEmail");
        router.push("/account/login");
      }, 1500);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Enter the OTP sent to{" "}
          <span className="font-medium text-gray-700">{email}</span>
        </p>

        <form action={formAction} className="space-y-6 text-sm">
          <input type="hidden" name="email" value={email} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP
            </label>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="w-full px-2 pb-2 border-b border-gray-400 focus:outline-none focus:border-gray-800"
              required
              maxLength="6"
              pattern="[0-9]*"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full px-2 pb-2 border-b border-gray-400 focus:outline-none focus:border-gray-800"
              required
              minLength="6"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="w-full px-2 pb-2 border-b border-gray-400 focus:outline-none focus:border-gray-800"
              required
              minLength="6"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full text-white py-2 rounded-md bg-black text-sm disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            {pending ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}