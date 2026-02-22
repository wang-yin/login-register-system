import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth_service";
import { generateToken } from "../utils/jwt_utils";
import { findById } from "../models/auth_model";
import { verifyPassword, hashPassword } from "../utils/bcrypt";
import { findByIdWithPassword, updatePassword } from "../models/auth_model";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "註冊成功", user });
  } catch (err: any) {
    if (err.message === "使用者已存在") {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: "註冊失敗", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await loginUser({ email, password });
    const token = generateToken(user._id.toString(), user.name);

    res.cookie("token", token, {
      httpOnly: true, // 核心：防止 JavaScript 讀取 (防 XSS)
      secure: process.env.NODE_ENV === "production", // 僅在 HTTPS 下傳輸
      sameSite: "lax" as const, // 防止 CSRF 攻擊的平衡設定
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "登入成功", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "無效的 Token 資訊" });
    }

    const user = await findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "找不到使用者" });
    }

    res.status(200).json({ user });
  } catch (err: any) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

// 1. 先定義一個簡易的介面，專門給有登入的請求用
interface AuthRequest extends Request {
  user?: { id: string; name: string };
}

export const changePassword = async (req: Request, res: Response) => {
  // 2. 轉型，告訴 TS：這個 req 是有 user 標籤的 AuthRequest
  const authReq = req as AuthRequest;

  try {
    const { oldPassword, newPassword } = req.body;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "認證失效，請重新登入" });
    }

    const user = await findByIdWithPassword(userId);

    // 4. 雙重檢查：人要在，且資料庫要有密碼 (排除 OAuth 使用者沒密碼的情況)
    if (!user || !user.password) {
      return res.status(404).json({ message: "找不到使用者或此帳號無需密碼" });
    }

    // 5. 驗證舊密碼
    const isMatch = await verifyPassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "舊密碼輸入錯誤" });
    }

    // 6. 加密並更新
    const hashedPassword = await hashPassword(newPassword);
    await updatePassword(userId, hashedPassword);
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "密碼修改成功" });
  } catch (err: any) {
    console.error("修改密碼失敗:", err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "登出成功" });
};
