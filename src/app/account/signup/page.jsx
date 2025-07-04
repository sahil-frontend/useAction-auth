"use client";

import { useActionState } from "react";
import { registerSchema } from "@/validation/schemas";
import { useCreateUserMutation } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignUp = () => {
  const [createUser] = useCreateUserMutation();
  const router = useRouter();

  const signUpAction = async (prevState, formData) => {
    const values = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    };

    console.log("Form values:", values); // Debug log

    // Validate with schema


    try {
      await registerSchema.validate(values, { abortEarly: false });
    } catch (validationError) {
      const errors = {};
      if (validationError.inner) {
        validationError.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
      }
      console.log("Validation errors:", errors); // Debug log
      return {
        errors,
        serverErrorMessage: "",
        serverSuccessMessage: "",
        success: false
      };
    }

    
    // If validation passes, proceed with API call
    try {
      console.log("Sending API request with data:", values); // Debug log
      const response = await createUser(values);
      console.log("API Response:", response); // Debug log
      
      if (response.data && response.data.status === "success") {
        return {
          errors: {},
          serverErrorMessage: "",
          serverSuccessMessage: response.data.message,
          success: true,
          email: values.email
        };
      }
      
      if (response.error) {
        console.log("API Error:", response.error); // Debug log
        const errorMessage = response.error.data?.message || "Registration failed";
        return {
          errors: {},
          serverErrorMessage: errorMessage,
          serverSuccessMessage: "",
          success: false
        };
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        errors: {},
        serverErrorMessage: "An unexpected error occurred",
        serverSuccessMessage: "",
        success: false
      };
    }

    return prevState;
  };

  const [state, formAction, isPending] = useActionState(signUpAction, {
    errors: {},
    serverErrorMessage: "",
    serverSuccessMessage: "",
    success: false,
    email: ""
  });

  // Handle redirection after successful signup
  useEffect(() => {
    if (state.success) {
      router.push(`/account/verify-email?email=${encodeURIComponent(state.email)}`);
    }
  }, [state.success, state.email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form className="space-y-4" action={formAction}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              id="name"
              name="name"
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.name && (
              <div className="text-red-500 text-sm mt-1">{state.errors.name}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              id="email"
              name="email"
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.email && (
              <div className="text-red-500 text-sm mt-1">{state.errors.email}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="*********"
              id="password"
              name="password"
              required
              minLength={8}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.password && (
              <div className="text-red-500 text-sm mt-1">{state.errors.password}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="*********"
              id="password_confirmation"
              name="password_confirmation"
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state.errors.password_confirmation && (
              <div className="text-red-500 text-sm mt-1">{state.errors.password_confirmation}</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/account/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
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

export default SignUp;



