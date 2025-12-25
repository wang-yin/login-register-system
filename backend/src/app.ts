import express from "express";
import passport from "passport";
import authRoutes from "./routes/auth_route";
import "./config/connection_db";
import "./config/passport";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
