
import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    paidDate: { type: Date, default: null },
    status: { type: String, enum: ["paid", "unpaid"], default: "paid" },
  },
  { timestamps: true },
);


export const Payment = model<IPayment>("Payment", paymentSchema);