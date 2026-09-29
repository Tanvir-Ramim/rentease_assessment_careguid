import Api from "./api";


export const logout = async () => {
  try {
    await Api.post("/auth/logout");
  } finally {
    window.location.href = "/login"; 
  }
};