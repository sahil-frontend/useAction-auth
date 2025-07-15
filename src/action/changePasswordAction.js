"use server";
import axiosClient from "@/lib/axiosClient";
import { changePasswordSchema } from "@/validation/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function changePasswordAction(state, formData) {
  console.log("🔄 changePasswordAction called");
  
  // Extract form data
  const password = formData.get("password");
  const password_confirmation = formData.get("password_confirmation");
  
  console.log("📝 Form data:", { 
    password: password ? "***" : "empty", 
    password_confirmation: password_confirmation ? "***" : "empty"
  });

  // Validate input
  const validatedFields = changePasswordSchema.safeParse({
    password,
    password_confirmation,
  });

  if (!validatedFields.success) {
    console.log("❌ Validation failed:", validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      serverErrorMessage: "Please fix the validation errors above.",
      serverSuccessMessage: "",
      success: false,
    };
  }

  const { password: validatedPassword, password_confirmation: validatedPasswordConfirmation } = validatedFields.data;

  try {
    console.log("🚀 Making API request to /user/change-password");
    
    // Get all cookies from the request
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();
    
    console.log("🍪 Cookies being sent:", cookieHeader ? "Present" : "Missing");
    
    const response = await axiosClient.put(
      "/user/change-password",
      {
        password: validatedPassword,
        password_confirmation: validatedPasswordConfirmation,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader, // Explicitly pass cookies
        },
      }
    );

    console.log("✅ API response:", {
      status: response.status,
      data: response.data
    });

    // Since axios throws for 4xx/5xx by default, if we reach here, it's successful
    return {
      success: true,
      serverSuccessMessage: response.data?.message || "Password changed successfully.",
      serverErrorMessage: "",
      errors: {},
      redirect: "/user/profile",
    };

  } catch (error) {
    console.error("❌ API Error:", error);
    
    if (error.response) {
      // Server responded with error status
      console.log("🔍 Error response:", {
        status: error.response.status,
        data: error.response.data
      });
      
      let message = error.response.data?.message;
      
      // Handle authentication errors specifically
      if (error.response.status === 401) {
        // Redirect to login page for authentication errors
        redirect("/login");
      }
      
      // Handle validation errors from server
      if (error.response.data?.errors) {
        const serverErrors = error.response.data.errors;
        
        // If it's field validation errors, return them as field errors
        if (typeof serverErrors === 'object' && !Array.isArray(serverErrors)) {
          return {
            success: false,
            serverSuccessMessage: "",
            serverErrorMessage: message || "Please fix the errors below.",
            errors: serverErrors,
          };
        }
        
        // If it's an array of errors, join them
        if (Array.isArray(serverErrors)) {
          message = serverErrors.join(', ');
        } else {
          message = Object.values(serverErrors).flat().join(', ');
        }
      }
      
      if (!message) {
        // Fallback based on status codes
        switch (error.response.status) {
          case 401:
            message = "Authentication failed. Please log in again.";
            break;
          case 403:
            message = "You don't have permission to change the password.";
            break;
          case 422:
            message = "Invalid password data provided.";
            break;
          case 500:
            message = "Server error. Please try again later.";
            break;
          default:
            message = `Server error (${error.response.status}). Please try again.`;
        }
      }
      
      return {
        success: false,
        serverSuccessMessage: "",
        serverErrorMessage: message,
        errors: {},
      };
      
    } else if (error.request) {
      // Network error
      console.log("🌐 Network error:", error.request);
      return {
        success: false,
        serverSuccessMessage: "",
        serverErrorMessage: "Unable to connect to the server. Please check your internet connection.",
        errors: {},
      };
      
    } else {
      // Other error
      console.log("⚠️ Unexpected error:", error.message);
      return {
        success: false,
        serverSuccessMessage: "",
        serverErrorMessage: "An unexpected error occurred. Please try again.",
        errors: {},
      };
    }
  }
}