import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth_route";
import "./config/connection_db";
import "./config/passport";

const BASE_URL = process.env.BASE_URL as string;

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: BASE_URL, // 這裡填寫你前端 Next.js 的網址（預設是 3000 或 3001）
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // 務必允許 Authorization 標頭
    credentials: true, // 如果未來要用到 Cookie 或 Passport Session 則必填
  }),
);

app.use(express.json());

app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
