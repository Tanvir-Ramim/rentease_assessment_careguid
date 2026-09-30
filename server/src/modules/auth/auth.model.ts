import { model, Schema } from "mongoose";
import { IUser } from "./auth.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "manager"],
      required: true,
      default: "manager",
    },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
