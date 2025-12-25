import { Router } from "express";
import { register, login } from "../controllers/auth_controller";
import passport from "passport";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// 引導用戶去 github 授權
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
// github 授權完後跳回的路徑
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/api/auth/login-failed",
  }),
  (req: any, res) => {
    res.status(200).json({
      message: "GitHub 登入成功！",
      user: req.user,
    });
  }
);

router.get("/login-failed", (req, res) => {
  res.status(401).json({ message: "OAuth 驗證失敗" });
});

export default router;
