"use server";

import axiosClient from "@/lib/axiosClient";
import { resetPasswordSchema } from "@/validation/schemas";

export async function resetPasswordLinkAction(state, formData) {
  try {
    const validatedFields = resetPasswordSchema.safeParse({
      email: formData.get("email"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email } = validatedFields.data;

    console.log("Sending OTP to:", email); // Debug log

    const response = await axiosClient.post("/user/forgot-password-send-otp", {
      email,
    });

    console.log("Response:", response.status, response.data); // Debug log

    // Check if the response status is 200 (success)
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        message: response.data.message || "OTP sent successfully",
        redirect: `/account/reset-password-confirm?email=${encodeURIComponent(email)}`
      };
    } else {
      return {
        error: response.data?.message || "Failed to send OTP",
      };
    }
  } catch (error) {
    console.error("Server action error:", error); // Debug log

    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || `Server error (${status})`;
      return { error: message };
    } else if (error.request) {
      return {
        error:
          "Unable to connect to the server. Please check your internet connection.",
      };
    } else {
      return {
        error:
          error.message || "An unexpected error occurred. Please try again.",
      };
    }
  }
}
