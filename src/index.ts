import { app } from "./app";
import connectDB from "./db/connect.db";
import { PORT } from "./utils/constants";

const startServer = async () => {
  try {
    await connectDB();
    const server = Bun.serve({
      port: PORT,
      fetch: app.fetch,
    });

    console.log(`Server running at ${server.url.host}`);
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer(); // Call the async function to start the server
