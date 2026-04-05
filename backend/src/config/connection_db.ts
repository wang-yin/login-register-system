import mongoose from 'mongoose';

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/login-system';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('成功連線至 MongoDB');
  } catch (err) {
    console.error('MongoDB 連線失敗:', err);
    process.exit(1); // 連線失敗就停止程式
  }
};
