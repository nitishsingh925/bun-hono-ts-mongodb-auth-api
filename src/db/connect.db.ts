import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../utils/constants";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
