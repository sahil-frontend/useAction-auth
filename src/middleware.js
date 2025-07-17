// middleware.js

import { NextResponse } from "next/server";

const authPaths = ["/account/login", "/account/signup"];

export async function middleware(request) {
  try {
    const isAuthenticated = request.cookies.get("is_auth")?.value;
    const path = request.nextUrl.pathname;

    if (isAuthenticated) {
      if (authPaths.includes(path)) {
        return NextResponse.redirect(new URL("/user/profile", request.url));
      }
    }

    if (!isAuthenticated && !authPaths.includes(path)) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/account/login", request.url));
  }
}

export const config = {
  matcher: ["/user/:path*", "/account/login", "/account/signup"],
};