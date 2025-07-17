// "use server";

// import axiosClient from "@/lib/axiosClient";

// export async function logoutAction() {
//   try {
//     // Extra debug: log before request
//     console.log("Calling /user/logout endpoint");
//     const response = await axiosClient.post(
//       "/user/logout",
//       {},
//       { withCredentials: true }
//     );
//     const data = response.data;
//     // Extra debug: log response
//     console.log("Logout response:", response.status, data);
//     if (
//       response.status === 200 &&
//       (data.success || data.status === "success")
//     ) {
//       return {
//         success: true,
//         message: data.message || "Logout successful.",
//         redirect: "/account/login",
//       };
//     } else {
//       return {
//         success: false,
//         error: data.message || "Logout failed. Please try again.",
//       };
//     }
//   } catch (error) {
//     // Extra debug: log error
//     console.error("Logout error:", error);
//     if (error.response) {
//       const message =
//         error.response.data?.message || "Logout failed. Please try again.";
//       return { success: false, error: message };
//     } else if (error.request) {
//       return {
//         success: false,
//         error: "Network error. Please check your connection.",
//       };
//     } else {
//       return { success: false, error: "Unexpected error occurred." };
//     }
//   }
// }
