import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database is connected properly");
  } catch (error) {
    console.error("Mongo DB connection failed");
    process.exit(1);
  }
};

export default connectDB