import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chat-app-srbx.onrender.com/api",
  withCredentials: true,

});
