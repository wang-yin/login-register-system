import { Request, Response } from "express";
import { generateToken } from "../utils/jwt_utils";

export const oauthSuccess = (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user) {
    return res.status(401).json({ message: "認證失敗" });
  }

  const token = generateToken(user._id.toString());
  res.status(200).json({
    message: "第三方登入成功",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};
