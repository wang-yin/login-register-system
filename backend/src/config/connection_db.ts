import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.log("環境變數 MONGODB_URI 未設定！");
  process.exit(1);
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB 連線成功！");
  } catch (err) {
    console.error("MongoDB 連線失敗:", err);
    process.exit(1);
  }
};

export default connectDB;
