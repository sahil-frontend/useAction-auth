"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoutUserMutation } from "@/lib/services/auth";

const Navbar = () => {
  const [user, setUser] = useState(null); // null = loading, object = authenticated, false = not authenticated
  const router = useRouter();
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : false);
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    window.addEventListener("auth-changed", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("auth-changed", checkUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear(); // Remove all localStorage data
      Cookies.remove("g_state"); // Remove Google session state cookie
      window.dispatchEvent(new Event("auth-changed")); // Notify Navbar
      const response = await logoutUser();
      setUser(false);
      console.log(response, "logout response");
      if (response.data.success === true) {
        router.push("/account/login"); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          MyAuthApp
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>

          {/* Authentication-based navigation */}
          {user === null ? (
            // Loading state while checking localStorage
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : user && user.name ? (
            // User is authenticated
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-blue-700">{user.name} ({user.email})</span>
              <Link
                href="/user/profile"
                className="hover:text-blue-600 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // User is not authenticated
            <div className="flex items-center space-x-4">
              <Link
                href="/account/login"
                className="hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/account/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;