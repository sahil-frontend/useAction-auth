import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^\d{10,15}$/, "Mobile number must be 10-15 digits"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});


export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
export const resetPasswordSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),

});

export const resetPasswordConfirmSchema = Yup.object({
  password: Yup.string()
   
    .required("Password is required"),
  password_confermation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const verifyEmailSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  otp: Yup.string()
   
    .required("OTP is required"),
});
export const changePasswordSchema = Yup.object({
  password: Yup.string()
    
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
   
});