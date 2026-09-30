
import { model, Schema } from "mongoose";
import { IProperty } from "./property.interface";

const propertySchema = new Schema<IProperty>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    managers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);


propertySchema.index({ managers: 1 });


export const Property = model<IProperty>("Property", propertySchema);