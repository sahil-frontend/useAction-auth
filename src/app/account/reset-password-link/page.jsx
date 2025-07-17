"use client";

import { resetPasswordLinkAction } from "@/action/resetPasswordLinkAction";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useActionState, useEffect } from "react";

const ResetPasswordLink = () => {
  const [state, formAction, isPending] = useActionState(
    resetPasswordLinkAction,
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.redirect) {
      toast.success(state.message || "OTP sent successfully!");
      
      // Store email for the next step
      const formData = new FormData();
      const email = state.email; // You'll need to return this from your action
      
      if (email) {
        sessionStorage.setItem("resetEmail", email);
      }
      
      setTimeout(() => {
        router.push(state.redirect);
      }, 1200);
    } else if (state?.error) {
      toast.error(state.error);
      console.log(state.error);
    }
    
    // Show field errors as toast if present
    if (state?.errors) {
      Object.values(state.errors).forEach((err) => {
        if (err) toast.error(Array.isArray(err) ? err.join(", ") : err);
      });
    }
  }, [
    state?.success,
    state?.redirect,
    state?.error,
    state?.errors,
    state?.message,
    router,
  ]);

  const handleSubmit = async (formData) => {
    const email = formData.get("email");
    if (email) {
      sessionStorage.setItem("resetEmail", email);
    }
    return formAction(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <form className="space-y-4" action={handleSubmit}>
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
              required
            />
            {state?.errors?.email && (
              <p className="text-red-500 text-sm mt-1">
                {Array.isArray(state.errors.email) 
                  ? state.errors.email.join(", ") 
                  : state.errors.email}
              </p>
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
};

export default ResetPasswordLink;