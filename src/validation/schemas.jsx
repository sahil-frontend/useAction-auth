import { z } from "zod";

// 📝 Registration Form Validation
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^\d{10,15}$/, "Mobile number must be 10-15 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// 🔐 Login Form Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// 📧 Reset Password (Step 1 - Send Email)
export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

// 🔒 Reset Password Confirmation (Step 2)
export const resetPasswordConfirmSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(4, "OTP must be at least 4 characters"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// ✅ Verify Email / OTP Schema (minimal)
export const verifyEmailSchema = z.object({
  otp: z.string().min(4, "OTP must be at least 4 digits"),
});

// 🔄 Change Password Schema
export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });
