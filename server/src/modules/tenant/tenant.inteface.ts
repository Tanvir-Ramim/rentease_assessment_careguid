
import { Types } from "mongoose";

export interface ITenant {
  name: string;
  phone: string;
  email: string;
  unit: Types.ObjectId;
  property: Types.ObjectId;
  moveInDate: Date;
  moveOutDate: Date | null; 
  createdAt: Date;
  updatedAt: Date;
}