
import { Types } from "mongoose";

export interface IUnit {
  property: Types.ObjectId;
  unitNumber: string;
  floor: number;
  monthlyRent: number;
  status: "vacant" | "occupied";
  createdAt: Date;
  updatedAt: Date;
}