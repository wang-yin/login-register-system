import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt_utils";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = verifyToken(token);

      req.user = decoded;

      next();
    } catch (error) {
      console.error("Token 驗證失敗:", error);
      return res.status(401).json({ message: "認證失敗，Token 無效" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "無權限，未提供 Token" });
  }
};
