
import Api from "../../../shared/utils/api";

export { getErrorMessage } from "../../property/service/propertyService";

export type TPaymentPayload = {
  tenant: string;
  month: string;
  amount: number;
  paidDate?: string;
  status: "paid" | "unpaid";
};

export const getPayments = async (
  params: Record<string, string | number | undefined>,
) => {
  const res = await Api.get("/payment", { params });
  return res.data;
};


export const createPayment = async (payload: TPaymentPayload) => {
  const res = await Api.post("/payment", payload);
  return res.data;
};