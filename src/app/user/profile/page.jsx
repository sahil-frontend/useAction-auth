"use client";

import { useGetUserQuery } from "@/lib/services/auth";
import { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState({});
  const { data, isSuccess, isLoading, isError, error } = useGetUserQuery();

  useEffect(() => {
    console.log("Fetched data:", data);
    console.log("isSuccess:", isSuccess);

    if (data && isSuccess) {
      setUser(data.user);
    }
  }, [data, isSuccess]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">
          Error: {error?.message || "Something went wrong."}
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{user?.name || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{user?.email || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Role:</span>
            <span className="capitalize">{user?.roles?.[0] || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Profile;
