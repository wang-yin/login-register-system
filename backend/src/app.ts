import express from "express";
import authRoutes from "./routes/auth_route";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

require("../src/config/connection_db");

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
