import { Types } from "mongoose";

type ScopeUser = { id: string; role: "admin" | "manager" };

export const roleScopeMatch = (user: ScopeUser, field = "managers") => {
  if (user.role === "admin") return { $match: {} };
  return { $match: { [field]: new Types.ObjectId(user.id) } };
};
