import { Request, Response } from "express";
import User from "../models/User";

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
