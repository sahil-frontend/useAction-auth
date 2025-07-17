// "use server";

// import axiosClient from "@/lib/axiosClient";
// import { loginSchema } from "@/validation/schemas";
// import { cookies } from "next/headers";

// export async function loginAction(prevState, formData) {
//   const validated = loginSchema.safeParse({
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   if (!validated.success) {
//     return {
//       success: false,
//       errors: validated.error.flatten().fieldErrors,
//     };
//   }

//   const { email, password } = validated.data;

//   try {
//     const res = await axiosClient.post(
//       "/user/login",
//       { email, password },
//       { 
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       }
//     );

//     const data = res.data;
    
//     // Extract cookies from response headers and set them in browser
//     const setCookieHeader = res.headers['set-cookie'];
    
//     if (setCookieHeader && Array.isArray(setCookieHeader)) {
//       const cookieStore = cookies();
      
//       setCookieHeader.forEach(cookie => {
//         // Parse cookie string
//         const [cookiePart, ...attributeParts] = cookie.split(';');
//         const [name, value] = cookiePart.split('=');
        
//         // Parse cookie attributes
//         const attributes = {};
//         attributeParts.forEach(attr => {
//           const [key, val] = attr.trim().split('=');
//           if (key.toLowerCase() === 'path') attributes.path = val;
//           if (key.toLowerCase() === 'expires') attributes.expires = new Date(val);
//           if (key.toLowerCase() === 'max-age') attributes.maxAge = parseInt(val);
//           if (key.toLowerCase() === 'httponly') attributes.httpOnly = true;
//           if (key.toLowerCase() === 'secure') attributes.secure = true;
//           if (key.toLowerCase() === 'samesite') attributes.sameSite = val;
//         });
        
//         // Set cookie in browser
//         cookieStore.set(name, value, attributes);
//       });
//     }

//     if (res.status === 200 && data.success) {
//       return {
//         success: true,
//         message: data.message,
//         redirect: "/user/profile",
//       };
//     }

//     return {
//       success: false,
//       error: data.message || "Login failed. Please try again.",
//     };
//   } catch (err) {
//     console.error('Login error:', err);
    
//     if (err.response) {
//       const message = err.response.data?.message || "Login failed. Please try again.";
//       return { success: false, error: message };
//     } else if (err.request) {
//       return { success: false, error: "Network error. Please check your connection." };
//     } else {
//       return { success: false, error: "Unexpected error occurred." };
//     }
//   }
// }