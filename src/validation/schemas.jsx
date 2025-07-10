import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^\d{10,15}$/, "Mobile number must be 10-15 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordConfirmSchema = z
  .object({
    password: z.string(),
    password_confermation: z.string(),
  })
  .refine((data) => data.password === data.password_confermation, {
    message: "Passwords must match",
    path: ["password_confermation"],
  });

export const verifyEmailSchema = z.object({
 ///// email: z.string().email("Invalid email"),
  otp: z.string(),
});

export const changePasswordSchema = z
  .object({
    password: z.string(),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });
