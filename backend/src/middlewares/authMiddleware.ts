import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt_utils';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 從 cookie 中抓取 token
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: '您尚未登入，請先登入' });
  }

  try {
    const decoded = verifyToken(token) as { id: string; name: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: '登入憑證已失效，請重新登入' });
  }
};
