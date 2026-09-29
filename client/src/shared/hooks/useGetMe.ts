
import { useEffect, useState } from "react";
import Api from "../utils/api";


export type TUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager";
};

const useGetMe = () => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Api.get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load user"),
      )
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
};

export default useGetMe;