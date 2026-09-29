
import axios, { type InternalAxiosRequestConfig } from "axios";

const Api = axios.create({
  baseURL: `http://localhost:5000/api/v1`,
  withCredentials: true,
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

Api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as RetryConfig;
    const url = original?.url || "";
    const skip = url.includes("/auth/login") || url.includes("/auth/refresh-token");

    if (error.response?.status === 401 && !original._retry && !skip) {
      original._retry = true;

      try {
        await Api.post("/auth/refresh-token"); 
        return Api(original); 
      } catch {
     
        const onAuthPage = ["/login", "/registration"].includes(window.location.pathname);
        if (!onAuthPage) window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default Api;