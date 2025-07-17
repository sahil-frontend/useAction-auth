import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001/api", // your backend base
  withCredentials: true,                // ✅ needed for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
