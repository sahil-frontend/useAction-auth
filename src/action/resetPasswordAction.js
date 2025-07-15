"use server";

import axiosClient from "@/lib/axiosClient";
import { resetPasswordConfirmSchema } from "@/validation/schemas";


export async function resetPasswordAction(state, formData) {
  try {
    const values = {
      email: formData.get("email"),
      otp: formData.get("otp"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    console.log("Raw form data:", values);

    // Check for empty values before validation
    if (!values.email || !values.otp || !values.newPassword || !values.confirmPassword) {
      console.log("Missing required fields:", {
        email: !!values.email,
        otp: !!values.otp,
        newPassword: !!values.newPassword,
        confirmPassword: !!values.confirmPassword
      });
      return { error: "All fields are required" };
    }

    const result = resetPasswordConfirmSchema.safeParse(values);

    if (!result.success) {
      console.log("Validation errors:", result.error.errors);
      const firstError = result.error.errors[0]?.message || "Invalid input";
      return { error: firstError };
    }

    const { email, otp, newPassword, confirmPassword } = result.data;
    console.log("Submitting:", { email, otp: "***", newPassword: "***", confirmPassword: "***" });

    const response = await axiosClient.post("/user/verify-forgot-password-otp", {
      email,
      otp,
      newPassword,
      confirmPassword
    });

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    // Check if the response indicates success
    if (response.status === 200 && response.data.success) {
      return { 
        success: true, 
        message: response.data.message || "Password reset successful" 
      };
    } else {
      return { 
        error: response.data?.message || "Password reset failed" 
      };
    }
  } catch (error) {
    console.error("Reset password error:", error);
    
    if (error.response) {
      console.log("Error response status:", error.response.status);
      console.log("Error response data:", error.response.data);
      return { 
        error: error.response.data?.message || "Reset failed. Please try again." 
      };
    } else if (error.request) {
      return { 
        error: "Unable to connect to server. Please check your connection." 
      };
    } else {
      return { 
        error: error.message || "An unexpected error occurred." 
      };
    }
  }
}