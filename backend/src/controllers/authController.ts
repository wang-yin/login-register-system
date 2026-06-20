import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      res.status(400).json({ message: "所有欄位（名稱、信箱、密碼）皆為必填" });
      return;
    }

    // 檢查 Email 是否已被註冊
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "該電子郵件已被註冊" });
      return;
    }

    // 加密並儲存
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "註冊成功！" });
  } catch (error) {
    console.error("註冊發生錯誤:", error);
    res.status(500).json({ message: "伺服器內部錯誤，請稍後再試" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "電子郵件與密碼皆為必填" });
      return;
    }

    // 尋找使用者是否存在
    const user = await User.findOne({ email });
    if (!user) {
      res.clearCookie("token");
      res.status(401).json({ message: "電子郵件或密碼錯誤" });
      return;
    }

    // 比對密碼
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.clearCookie("token");
      res.status(401).json({ message: "電子郵件或密碼錯誤" });
      return;
    }

    // 密碼正確，簽發 JWT Token
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const token = jwt.sign({ userName: user.name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // 防禦 XSS 攻擊
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 只在 https 下傳輸（開發環境先關掉）
      sameSite: "lax", // 防禦 CSRF 攻擊
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie 有效期跟著 Token 走 (7天)
    });

    res.status(200).json({
      message: "登入成功！",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("登入出錯了：", error);
    res.status(500).json({ message: "伺服器錯誤，請稍後再試" });
  }
};
