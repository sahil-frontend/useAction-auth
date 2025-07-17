"use client";
import { useLogoutUserMutation, useGetUserQuery } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

const UserSidebar = () => {
  const [logoutUser] = useLogoutUserMutation();
  const router = useRouter();
  const { data, isSuccess, isLoading, isError, error } = useGetUserQuery();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      console.log(response, "logout response");
      if (response.data && response.data.status === "success") {
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Loading state
  if (isLoading) return null;

  // Only show Change Password if user does NOT have googleId
  const showChangePassword = !data?.user?.googleId;
  console.log(data, "side bar data");
  return (   
    <div className="w-64 min-h-screen bg-white border-r shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">User Menu</h2>
      <ul className="space-y-4 text-sm text-gray-700">
        <li>
          <a
            href="/user/profile"
            className="block hover:text-blue-600 transition font-medium"
          >
            Profile
          </a>
        </li>
        {showChangePassword && (
          <li>
            <a
              href="/user/chnage-password"
              className="block hover:text-blue-600 transition font-medium"
            >
              Change Password
            </a>
          </li>
        )}
        <li>
          <button
            onClick={handleLogout}
            className="block hover:text-red-500 transition font-medium"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
