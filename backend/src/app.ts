import express, { Response, Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connection_db";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`⚡️ [Server]: Server is running at http://localhost:${PORT}`);
});
