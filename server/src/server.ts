import app from "./app";

const PORT = 5000;
async function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running is on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error Starting the Server", error);
  }
}

main();
