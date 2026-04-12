import { Request, Response } from 'express';
import { generateToken } from '../utils/jwt_utils';

const TEST_FAILED_URL = process.env.TEST_FAILED_URL as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

export const oauthSuccess = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) return res.redirect(TEST_FAILED_URL);

  const token = generateToken(user.id.toString(), user.name);

  res.cookie('auth_token', token, {
    httpOnly: true, // 核心安全設定：前端 JS 無法讀取
    secure: false, // 開發環境 localhost 用 false，部署到 HTTPS 後改為 true
    sameSite: 'lax', // 預防 CSRF 攻擊
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie 有效期（例如 7 天）
  });

  res.redirect(`${FRONTEND_URL}/auth/dashboard`);
};
