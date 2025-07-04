"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/lib/services/auth";
import { loginSchema } from "@/validation/schemas";

const Login = () => {
  const router = useRouter();
  const [loginUser] = useLoginUserMutation();

  // Action handler
  const loginAction = async (prevState, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    const values = { email, password };

    try {
      await loginSchema.validate(values, { abortEarly: false });
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
      const response = await loginUser(values);

      if (response.data && response.data.status === "success") {
       
        document.cookie = "is_auth=true; path=/";

      
        router.push("/user/profile");

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
      return {
        errors: {},
        serverErrorMessage: "An unexpected error occurred.",
        serverSuccessMessage: "",
        success: false,
      };
    }

    return prevState;
  };

  const [state, formAction, isPending] = useActionState(loginAction, {
    errors: {},
    serverErrorMessage: "",
    serverSuccessMessage: "",
    success: false,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form className="space-y-4" action={formAction}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.email && (
              <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.password}
              </p>
            )}
          </div>

          <p className="mt-2 text-sm text-center text-gray-600">
            Forgot password?{" "}
            <a
              href="/account/reset-password-link"
              className="text-blue-600 hover:underline"
            >
              Reset here
            </a>
          </p>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/account/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>

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

export default Login;
