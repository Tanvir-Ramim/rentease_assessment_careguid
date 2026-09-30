import axios from "axios";

const Api = axios.create({
  // baseURL: `http://localhost:5000/api/v1`,
  baseURL: `https://renteasecare-server.vercel.app/api/v1`,

  withCredentials: true,
});

Api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.data?.errorCode === "SESSION_EXPIRED") {
      const onAuthPage = ["/login"].includes(window.location.pathname);
      if (!onAuthPage) window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);

export default Api;
