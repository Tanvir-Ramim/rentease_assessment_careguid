import Api from "../../../shared/utils/api";
import type { TPropertyDetails } from "../../../shared/utils/allTypes";

export { getErrorMessage } from "../../property/service/propertyService";

export type TUnitPayload = {
  unitNumber: string;
  floor: number;
  monthlyRent: number;
};

export const getPropertyDetails = async (
  id: string,
): Promise<TPropertyDetails> => {
  const res = await Api.get(`/properties/${id}`);
  return res.data.data;
};

export const getUnits = async (
  params: Record<string, string | number | undefined>,
) => {
  const res = await Api.get("/unit", { params });
  return res.data;
};

export const createUnit = async (
  payload: TUnitPayload & { property: string },
) => {
  const res = await Api.post("/unit", payload);
  return res.data;
};

export const updateUnit = async (id: string, payload: TUnitPayload) => {
  const res = await Api.patch(`/unit/${id}`, payload);
  return res.data;
};

export const deleteUnit = async (id: string) => {
  const res = await Api.delete(`/unit/${id}`);
  return res.data;
};
