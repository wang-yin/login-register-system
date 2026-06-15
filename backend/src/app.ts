import express, { Response, Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connection_db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`⚡️ [Server]: Server is running at http://localhost:${PORT}`);
});
