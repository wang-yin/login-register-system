import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth_service";
import { generateToken } from "../utils/jwt_utils";
import { findById } from "../models/auth_model";

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
    const user = await loginUser(req.body);
    const token = generateToken(user._id.toString(), user.name);

    res.cookie("token", token, {
      httpOnly: true, // 核心：防止 JavaScript 讀取 (防 XSS)
      secure: process.env.NODE_ENV === "production", // 僅在 HTTPS 下傳輸
      sameSite: "lax", // 防止 CSRF 攻擊的平衡設定
      maxAge: 7 * 24 * 60 * 60 * 1000, // 過期時間 (例如 7 天)
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
