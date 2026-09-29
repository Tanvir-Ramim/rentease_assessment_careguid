
import { Types } from "mongoose";

export interface IProperty {
  name: string;
  address: string;
  city: string;
  managers: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}