"use server";

import axiosClient from "@/lib/axiosClient";
import { clearTempUser, getTempUser } from "@/lib/session";
import { verifyEmailSchema } from "@/validation/schemas";

export async function otpVerifyAction(state, formData) {
  const validatedFields = verifyEmailSchema.safeParse({
    otp: formData.get("otp"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { otp } = validatedFields.data;

  try {
    const tempSession = await getTempUser();
    if (!tempSession) {
      return { error: "Session expired. Please try again." };
    }
    const email = tempSession.email;
    const response = await axiosClient.post(
      "/user/verify-otp",
      { otp, email },
      { withCredentials: true }
    );
    const data = response.data;

    if (response.status === 200 && data.success) {
      await clearTempUser();
      return { success: true, message: data.message, redirect: "/account/login" };
    } else {
      return { error: data.message || "Unknown error" };
    }
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.message || "Unknown error";
      return { error: message };
    } else if (error.request) {
      return { error: "No response from server. Check your network." };
    } else {
      return { error: "Something went wrong: " + error.message };
    }
  }
}
