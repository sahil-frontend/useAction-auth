"use client";

import { otpVerifyAction } from "@/actions/otpVerifyAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from 'react-toastify';

export default function OtpVerify() {
  const [state, action, pending] = useActionState(otpVerifyAction, null);
  const [resendEnabled, setResendEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect);
      toast.success(state.message);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResendEnabled(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleResend = () => {
    // console.log("Resend OTP clicked");
    setResendEnabled(false);
    setTimeout(() => {
      setResendEnabled(true);
    }, 30000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Verify Your Account
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          We've sent a 6-digit OTP to your registered email. Enter it below to
          verify your account.
        </p>

        <form action={action}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2"
          />

          {state?.errors?.otp && (
            <p className="text-red-500 text-sm mb-2">{state.errors.otp[0]}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
            disabled={pending}
          >
            {pending ? "Verifying..." : "Verify OTP"}
          </button>


          <div className="text-center text-xs text-gray-500 mt-6">
            {!resendEnabled ? (
              <span className="text-gray-400">You can resend OTP in 30s</span>
            ) : (
              <span>
                Didn't receive the OTP?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary font-medium hover:underline"
                >
                  Resend
                </button>
              </span>
            )}
          </div>
        </form>
        <p className="text-sm text-gray-500 text-center mt-6">
          <Link href="/signup" className="text-primary font-medium hover:underline text-blue-500">Back to signup</Link>
        </p>
      </div>
    </section>
  );
}
