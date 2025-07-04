"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(null); // Change this based on actual auth logic
useEffect(()=>{
  const authCookie = Cookies.get('is_auth');
  setIsAuth(authCookie );
})

  return (
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">MyAuthApp</div>

      {/* Nav Links */}
      <nav className="flex space-x-6 text-sm font-medium text-gray-700">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>

        {isAuth ? (
          <Link href="/user/profile" className="hover:text-blue-600">
            profile
          </Link>
        ) : (
          <>
            <Link href="/account/login" className="hover:text-blue-600">
              Login
            </Link>
            <Link href="/account/signup" className="hover:text-blue-600">
              SignUp
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
