import { Router } from "express";
import {
  register,
  login,
  oauthLogin,
  logout,
  getCurrentUser,
  updateProfileOrPassword,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/oauth/callback", oauthLogin);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, updateProfileOrPassword);

export default router;
