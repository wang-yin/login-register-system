import express from "express";
import authRoutes from "./routes/auth_route";
import "./config/connection_db";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
