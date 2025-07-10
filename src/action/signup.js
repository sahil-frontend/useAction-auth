"use server";

import { registerSchema } from "@/validation/schemas";
; // ✅ Added this import
// adjust path if needed
import axiosClient from "@/lib/axiosClient";
import { createTempUserSession } from "@/lib/session";

export async function signupFormAction(state, formData) {
  console.log("✅ signupFormAction triggered");

  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    mobile: formData.get("mobile"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, mobile, email, password } = validatedFields.data;
  console.log("Validated user data:", validatedFields.data);

  try {
    const response = await axiosClient.post(
      "/user/signup",
      {
        name,
        mobile,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const user = response.data;
    console.log("Signup response:", user);

    if (response.status === 200) {
        await createTempUserSession(email);
       
        
        return {
          success: true,
          message: user.message,
          redirect: "/account/otpverification", // ✅ this is returned
        };
      }
      
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Unknown error";

      return { error: message };
    } else if (error.request) {
      return {
        error:
          "Unable to connect to the server. Please check your internet connection.",
      };
    } else {
      return { error: "An unexpected error occurred. Please try again." };
    }
  }
}
