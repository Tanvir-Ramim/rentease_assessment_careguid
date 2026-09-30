
import { model, Schema } from "mongoose";
import { IUnit } from "./unit.interface";


const unitSchema = new Schema<IUnit>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    unitNumber: { type: String, required: true, trim: true },
    floor: { type: Number, required: true },
    monthlyRent: { type: Number, required: true },
    status: { type: String, enum: ["vacant", "occupied"], default: "vacant" },
  },
  { timestamps: true },
);

unitSchema.index({ property: 1, unitNumber: 1 }, { unique: true });


export const Unit = model<IUnit>("Unit", unitSchema);