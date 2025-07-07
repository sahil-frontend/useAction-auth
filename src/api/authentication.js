import axiosClient from "@/lib/axiosClient";

export const createUser = async (data) => {
    try {
      const response = await axiosClient.post("/user/login", data);
      return { data: response.data };
    } catch (error) {
      return { error: error.response || error };
    }
  };
  