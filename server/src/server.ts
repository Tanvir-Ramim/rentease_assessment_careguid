import mongoose from "mongoose";
import config from "./config";
import app from "./app";

const PORT = config.port;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Mongodb Connect successfully");
    app.listen(PORT, () => {
      console.log(`Server is running is on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error Starting the Server", error);
  }
}

main();
