"use server";

import axiosClient from "@/lib/axios";
import { OtpFormSchema } from "@/lib/defination";
import { clearTempUser, getTempUser } from "@/lib/session";

export async function otpVerifyAction(state, formData) {
    const validatedFields = OtpFormSchema.safeParse({
        otp: formData.get("otp"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { otp } = validatedFields.data;

    // console.log("otp", otp)

    try {
        const tempSession = await getTempUser();
        if (!tempSession) {
            return { error: "Session expired. Please try again." };
        }
        const response = await axiosClient.post("/auth/verify-otp", {
            otp, email: tempSession?.email
        }, {
            withCredentials: true,
        });
        // console.log("response otp", response.data)
        const data = response.data

        if (response.status === 200) {
            await clearTempUser();
            return { success: true, message: data.message, redirect: '/login' };
        }
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || "Unknown error";

            if (status === 400) {
                return { error: message };
            } else {
                return { error: message };
            }
        } else if (error.request) {
            return { error: "No response from server. Check your network." };
        } else {
            return { error: "Something went wrong: " + error.message };
        }
    }
}
