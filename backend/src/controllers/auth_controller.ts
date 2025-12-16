import { Request, Response } from "express";
import { registerUser, loginUser } from "../models/auth_model";

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
    res.status(201).json({ message: "登入成功", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
