import mongoose from "mongoose";
import app from "../src/app";
import config from "../src/config";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(config.database_url as string);
};

export default async function handler(req: any, res: any) {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}
