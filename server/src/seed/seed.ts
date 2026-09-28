import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../modules/auth/auth.model";
import bcrypt from "bcryptjs";
import config from "../config";

const seed = async () => {
  await mongoose.connect(config.database_url as string);
  console.log("MongoDB connected");

  await User.deleteMany({
    email: {
      $in: ["admin@rentease.com", "tanvir@rentease.com", "ramim@rentease.com"],
    },
  });

  const password = await bcrypt.hash(
    "123456",
    Number(config.bcrypt_salt_rounds),
  );

  await User.insertMany([
    {
      name: "Admin User",
      email: "admin@rentease.com",
      password,
      role: "admin",
    },
    {
      name: "Tanvir",
      email: "tanvir@rentease.com",
      password,
      role: "manager",
    },
    {
      name: "Ramim",
      email: "ramim@rentease.com",
      password,
      role: "manager",
    },
  ]);

  console.log("Seeded 1 admin and 2 managers");
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
