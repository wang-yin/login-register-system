import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 擴充 Express 的 Request 型別，讓 TypeScript 知道 req 上面可以掛載 userId 和 email
export interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // 1. 從 Cookie 中取出當初鎖進去的 token
    // 💡 註：後端必須使用 `cookie-parser` 套件才能直接讀取 req.cookies
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "未授權，請先登入" });
      return;
    }

    // 2. 驗證並解密 Token
    const JWT_SECRET = (process.env.JWT_SECRET ||
      "YOUR_JWT_SECRET_KEY") as string;
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    // 3. 將解密出來的資料掛載到 req 物件上，讓後續的 Controller 可以直接用
    req.userId = decoded.userId;
    req.email = decoded.email;

    // 4. 通過驗證，繼續執行下一個 Controller
    next();
  } catch (error: any) {
    console.error("JWT 驗證失敗:", error.message);

    // 如果是 Token 過期，給予精準提示
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "登入憑證已過期，請重新登入" });
      return;
    }

    res.status(401).json({ message: "無效的登入憑證" });
  }
};
