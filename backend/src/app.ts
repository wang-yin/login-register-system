import express from 'express';
import { connectDB } from './config/connection_db';

const PORT = 5000;

const app = express();

const startServer = async () => {
  try {
    // 1. 先等資料庫連線
    await connectDB();

    // 2. 資料庫連上後，才啟動 Express
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 後端啟動成功：http://localhost:${PORT}`);
      console.log(`✅ 已確認 MongoDB 連線正常`);
    });
  } catch (error) {
    console.error('❌ 啟動失敗:', error);
    process.exit(1);
  }
};

startServer();
