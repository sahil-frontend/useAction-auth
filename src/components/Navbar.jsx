"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true = authenticated, false = not authenticated
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authCookie = Cookies.get('is_auth');
      console.log('Auth cookie value:', authCookie); // Debug log
      
      // Check if cookie exists and equals "true" (exact match)
      const isAuthenticated = authCookie === 'true';
      setIsAuth(isAuthenticated);
    };

    // Check auth on mount
    checkAuth();

    // Optional: Listen for auth changes (if you have custom events)
    const handleAuthChange = () => {
      checkAuth();
    };

    // You can add custom event listeners here if needed
    window.addEventListener('auth-changed', handleAuthChange);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear all auth-related cookies
    Cookies.remove('is_auth');
    Cookies.remove('access_token'); // Add other auth cookies if you have them
    Cookies.remove('refresh_token');
    
    // Update state to false (not authenticated)
    setIsAuth(false);
    
    // Redirect to home or login
    router.push('/');
    
    // Optional: Dispatch custom event for other components
    window.dispatchEvent(new Event('auth-changed'));
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
          {isAuth === null ? (
            // Loading state while checking cookies
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : isAuth === true ? (
            // User is authenticated (is_auth cookie = "true")
            <div className="flex items-center space-x-4">
              <Link 
                href="/user/profile" 
                className="hover:text-blue-600 transition-colors"
              >
                Profile
              </Link>
              <Link 
                href="/user/change-password" 
                className="hover:text-blue-600 transition-colors"
              >
                Change Password
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // User is not authenticated (is_auth cookie != "true" or doesn't exist)
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