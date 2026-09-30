
import { useEffect, useState } from "react";
import Api from "../utils/api";
import type { TProperty } from "../utils/allTypes";

const useProperties = () => {
  const [properties, setProperties] = useState<TProperty[]>([]);

  useEffect(() => {
    Api.get("/properties", { params: { limit: 100 } })
      .then((res) => setProperties(res.data.data))
      .catch(() => setProperties([]));
  }, []);

  return properties;
};

export default useProperties;