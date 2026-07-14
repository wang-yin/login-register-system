import { Router } from "express";
import {
  register,
  login,
  oauthLogin,
  logout,
  getCurrentUser,
  updateProfileOrPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/oauth/callback", oauthLogin);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, updateProfileOrPassword);
router.post("/verify-email", verifyEmail);
router.post("/send-verification", authMiddleware, sendVerificationEmail);

export default router;
