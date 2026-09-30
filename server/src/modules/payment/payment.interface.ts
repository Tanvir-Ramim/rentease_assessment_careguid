
import { Types } from "mongoose";

export interface IPayment {
  tenant: Types.ObjectId;
  unit: Types.ObjectId;
  property: Types.ObjectId; 
  month: string;
  amount: number;
  paidDate: Date | null;
  status: "paid" | "unpaid";
  createdAt: Date;
  updatedAt: Date;
}