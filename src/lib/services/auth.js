import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api/user/" }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => {
        return {
          url: "signup",
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),


    
    verfyEmail: builder.mutation({
      query: (user) => {
        return {
          url: "otpverification",
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),



    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: "login",
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", ////it is required to set cookies
        };
      },
    }),


    getUser: builder.query({
      query: () => {
        return {
          url: "me",
          method: "GET",
          credentials: "include", ////it is required to set cookies
        };
      },
    }),



    logoutUser: builder.mutation({
      query: () => {
        return {
          url: `logout`,
          method: "POST",
          body: {},
          credentials: "include", ////it is required to set cookies
        };
      },
    }),

    

    resetPasswordLink: builder.mutation({
      query: (user) => {
        return {
          url: `reset-password-link`,
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),



    resetPassword: builder.mutation({
      query: (data) => {
        const { id, token, ...values } = data;
        const actualdata = { ...values };
        return {
          url: `/reset-password/${id}/${token}`,
          method: "POST",
          body: actualdata,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),




    changePassword: builder.mutation({
      query: (actualdata) => {
        return {
          url: "change-password",
          method: "POST",
          body: actualdata,
          credentials: "include", ////it is required to set cookies
        };
      },
    }),
  }),
});




export const {
  useCreateUserMutation,
  useVerfyEmailMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useLogoutUserMutation,
  useResetPasswordLinkMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authAPI;
