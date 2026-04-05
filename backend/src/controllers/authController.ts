import { Request, Response } from 'express';
import { authService } from '../services/authService';

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
