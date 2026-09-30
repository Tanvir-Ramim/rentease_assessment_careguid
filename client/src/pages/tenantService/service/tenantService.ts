
import Api from "../../../shared/utils/api";

export { getErrorMessage } from "../../property/service/propertyService";

export type TTenantPayload = {
  name: string;
  phone: string;
  email: string;
  moveInDate: string;
};

export const getTenants = async (
  params: Record<string, string | number | undefined>,
) => {
  const res = await Api.get("/tanant", { params });
  return res.data; 
};

export const createTenant = async (payload: TTenantPayload & { unit: string }) => {
  const res = await Api.post("/tanant", payload);
  return res.data;
};

export const updateTenant = async (id: string, payload: TTenantPayload) => {
  const res = await Api.patch(`/tanant/${id}`, payload);
  return res.data;
};

export const moveOutTenant = async (id: string) => {
  const res = await Api.patch(`/tanant/${id}/move-out`, {});
  return res.data;
};

export const deleteTenant = async (id: string) => {
  const res = await Api.delete(`/tanant/${id}`);
  return res.data;
};