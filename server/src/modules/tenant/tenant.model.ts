
import { model, Schema } from "mongoose";
import { ITenant } from "./tenant.inteface";


const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    moveInDate: { type: Date, required: true },
    moveOutDate: { type: Date, default: null },
  },
  { timestamps: true },
);



export const Tenant = model<ITenant>("Tenant", tenantSchema);