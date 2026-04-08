/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { generateToken } from '../utils/jwt_utils';

// register
export const register = async (req: Request, res: Response) => {
  try {
    const newUser = await authService.register(req.body);
    res.status(201).json({ message: '註冊成功', user: newUser });
  } catch (error: any) {
    if (error.message === 'USER_EXISTS') {
      return res.status(400).json({ message: '此 Email 已被註冊' });
    }
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;

    const user = await authService.login({ email, password });
    const token = generateToken(user._id.toString(), user.name);

    const tokenExpiry = 24 * 60 * 60 * 1000;
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: tokenExpiry,
      path: '/',
    });

    if (remember) {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      res.cookie('remember_email', email, {
        httpOnly: true, // 核心：防止 JavaScript 讀取 (防 XSS)
        secure: true, // 開發環境先設為 false
        sameSite: 'none', // 防止 CSRF 攻擊的平衡設定
        maxAge: sevenDays,
        path: '/',
      });
    } else {
      // 如果沒勾選，清除該 Cookie
      res.clearCookie('remember_email', { path: '/' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: { user },
    });
  } catch (error: any) {
    return res.status(401).json({
      status: 'fail',
      message: error.message || 'INVALID_CREDENTIALS',
    });
  }
};

// remember me
export const getRememberedEmail = (req: Request, res: Response) => {
  // cookie-parser 會把 cookie 放在 req.cookies
  const email = req.cookies.remember_email || '';
  res.status(200).json({ email });
};

// jwt
export const profile = async (req: Request, res: Response) => {
  try {
    const user = await authService.profile(req.user!.id);
    return res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error: any) {
    return res.status(404).json({
      status: 'fail',
      message: error.message || '無法取得使用者資料',
    });
  }
};

// change-password
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'fail',
        message: '請提供舊密碼與新密碼',
      });
    }

    await authService.updatePassword(req.user!.id, {
      currentPassword,
      newPassword,
    });
    return res.status(200).json({
      status: 'success',
      message: '密碼更新成功',
    });
  } catch (error: any) {
    // 4. 錯誤處理：根據 Service 丟出的 Error 訊息回傳對應狀態
    let statusCode = 400;
    let message = error.message || '更新密碼失敗';

    if (error.message === 'CURRENT_PASSWORD_INVALID') {
      message = '舊密碼輸入錯誤';
    } else if (error.message === 'USER_NOT_FOUND') {
      statusCode = 404;
      message = '找不到該使用者';
    }

    return res.status(statusCode).json({
      status: 'fail',
      message,
    });
  }
};
