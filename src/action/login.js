"use server"


import axiosClient from "@/lib/axiosClient"
import { loginSchema } from "@/validation/schemas"

export async function loginAction(state, formData) {
    const validatedFields = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.errors.flatten().fieldErrors

        }
    }
    const { email, password } = validatedFields.data
    try {

        const response = await axiosClient.post('/user/login', {
            email,
            password
        },
            {
                withCredentials: true,
            })

        const user = response.data

        if (response.status === 200) {
            return {
                success: true,
                massage: user.message,
                redirect: "/"
            }
        }

    } catch (error) {
        if (error.response) {
            const status = error.response.status
            const message = error.response.data?.message || "Unknown error"
            if (status === 400) {
                return { error: message }

            } else if (status === 404) {
                return { error: message }
            } else if (status === 409) {
                return { error: message }
            } else {
                return {
                    error: "Something went wrong please try again later"
                }
            }
        } else if (error.request) {
            return {
                error: "Unable to connect ot server .Please check our internet connection"
            }
        } else {
            return {
                error: " An unexpected error occurred . Please try again"
            }
        }

    }

}
