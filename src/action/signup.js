"use server"

import { registerSchema } from "@/validation/schemas";
import { createUser } from "@/api/authentication";


export async function signupFormAction(state, formData) {
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

    try {
        const response = await axiosClient.post("/user/signup", {
            name,
            mobile,
            email,
            password,
        }, {
            withCredentials: true,
        });

        const user = response.data;
        // console.log("signup user",user);

        if (response.status === 200) {
            await createTempUserSession(email);
            return { 
                success: true, 
                message: user.message, 
                redirect: '/otpverification' 
            };
        }
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || "Unknown error";

            if (status === 400) {
                return { error: message };
            } else if (status === 404) {
                return { error: message };
            } else if (status === 409) {
                return { error: message };
            } else {
                return { error: "Something went wrong. Please try again later." };
            }
        } else if (error.request) {
            return { error: "Unable to connect to the server. Please check your internet connection." };
        } else {
            return { error: "An unexpected error occurred. Please try again." };
        }
    }
}

// useEffect(() => {
//     if (state.success) {
//       router.push(`/account/verify-email?email=${encodeURIComponent(state.email)}`);
//     }
//   }, [state.success, state.email, router]); registerSchema const response = await createUser(values);