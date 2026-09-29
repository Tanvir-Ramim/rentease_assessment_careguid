import type { TManager } from "../../../shared/utils/allTypes";
import Api from "../../../shared/utils/api";

export type TPropertyPayload = {
  name: string;
  address: string;
  city: string;
};

export const getErrorMessage = (error: unknown) => {
  const e = error as { response?: { data?: { message?: string } } };
  return e.response?.data?.message || "Something went wrong. Please try again.";
};

export const getProperties = async (
  params: Record<string, string | number | undefined>,
) => {
  const res = await Api.get("/properties", { params });
  return res.data;
};

export const createProperty = async (payload: TPropertyPayload) => {
  const res = await Api.post("/properties", payload);
  return res.data;
};

export const updateProperty = async (id: string, payload: TPropertyPayload) => {
  const res = await Api.patch(`/properties/${id}`, payload);
  return res.data;
};

export const deleteProperty = async (id: string) => {
  const res = await Api.delete(`/properties/${id}`);
  return res.data;
};

export const getManagers = async (): Promise<TManager[]> => {
  const res = await Api.get("/auth/managers");
  return res.data.data;
};

export const assignManagers = async (id: string, managerIds: string[]) => {
  const res = await Api.patch(`/properties/${id}/managers`, { managerIds });
  return res.data;
};



