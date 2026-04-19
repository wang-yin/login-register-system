/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { generateToken } from '../utils/jwt_utils';
import { sendEmail } from '../utils/email_servuce';

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
      sameSite: 'none',
      maxAge: tokenExpiry,
      path: '/',
    });

    if (remember) {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      res.cookie('remember_email', email, {
        httpOnly: true, // 核心：防止 JavaScript 讀取 (防 XSS)
        secure: true, // 開發環境先設為 false
        sameSite: 'none',
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

    if (!newPassword) {
      return res.status(400).json({
        status: 'fail',
        message: '請提供新密碼',
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

    switch (error.message) {
      case 'CURRENT_PASSWORD_INVALID':
        message = '舊密碼輸入錯誤';
        break;
      case 'CURRENT_PASSWORD_REQUIRED':
        message = '此帳號需輸入舊密碼才能修改';
        break;
      case 'NEW_PASSWORD_MUST_BE_DIFFERENT':
        message = '新密碼不能與舊密碼相同';
        break;
      case 'USER_NOT_FOUND':
        statusCode = 404;
        message = '找不到該使用者';
        break;
    }

    return res.status(statusCode).json({
      status: 'fail',
      message,
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await authService.getMe(req.user!.id);
    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        providers: user.providers,
        hasPassword: !!user.password,
      },
    });
  } catch (error: any) {
    res.status(404).json({
      status: 'fail',
      message: error.message || '找不到使用者',
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const resetToken = await authService.forgotPassword(email);

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
    const message = `
      <h1>您請求了密碼重設</h1>
      <p>請點擊下方的連結來重設您的密碼：</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>這條連結將在 1 小時後失效。</p>
      <p>如果您沒有要求重設密碼，請忽略此郵件。</p>
    `;

    try {
      await sendEmail({
        email: email,
        subject: '密碼重設連結',
        html: message,
      });
      res.status(200).json({
        status: 'success',
        message: '重設連結已寄送到您的電子信箱',
      });
    } catch (err) {
      await authService.clearResetToken(email);
      console.error('Email 寄送失敗:', err);
      return res.status(500).json({
        status: 'error',
        message: '郵件發送失敗，請稍後再試',
      });
    }
  } catch (error: any) {
    let statusCode = 400;
    let message = error.message;

    if (error.message === 'EMAIL_NOT_FOUND') {
      message = '找不到使用該 Email 的帳號';
    }

    res.status(statusCode).json({
      status: 'fail',
      message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        status: 'fail',
        message: '請提供有效的重設憑證與新密碼',
      });
    }
    await authService.resetPassword(token, password);
    res.status(200).json({
      status: 'success',
      message: '密碼重設成功，請使用新密碼登入',
    });
  } catch (error: any) {
    let message = '密碼重設失敗';
    let statusCode = 400;

    if (error.message === 'TOKEN_INVALID_OR_EXPIRED') {
      message = '重設連結已失效或 Token 錯誤，請重新申請';
    }

    res.status(statusCode).json({
      status: 'fail',
      message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    expires: new Date(0), // 設定為過去的時間，瀏覽器會立即刪除它
    secure: true,
    sameSite: 'none',
    path: '/', // 確保路徑一致
  });

  res.status(200).json({
    status: 'success',
    message: '已成功登出',
  });
};
