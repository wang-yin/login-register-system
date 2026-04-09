import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/connection_db';
import authRoutes from './routes/authRoute';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000', // 這裡填寫你前端 Next.js 的網址（預設是 3000 或 3001）
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], // 務必允許 Authorization 標頭
    credentials: true, // 如果未來要用到 Cookie 或 Passport Session 則必填
  }),
);

app.use(express.json());

app.use('/api/auth', authRoutes);

const startServer = async () => {
  try {
    // 1. 先等資料庫連線
    await connectDB();

    // 2. 資料庫連上後，才啟動 Express
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`後端啟動成功：http://localhost:${PORT}`);
      console.log(`已確認 MongoDB 連線正常`);
    });
  } catch (error) {
    console.error('啟動失敗:', error);
    process.exit(1);
  }
};

startServer();
