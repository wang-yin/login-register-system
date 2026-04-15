import User from '../models/schema/UserSchema';
import { hashPassword, verifyPassword } from '../utils/bcrypt';
import { RegisterDTO, LoginDTO, UpdatePasswordDTO } from '../types/auth';
import crypto from 'crypto';

export const authService = {
  register: async (data: RegisterDTO) => {
    const email = data.email.toLowerCase();
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new Error('USER_EXISTS');

    const hashedPassword = await hashPassword(data.password);

    const newUser = await User.create({
      name: data.name,
      password: hashedPassword,
      email: email,
    });

    // 回傳時移除密碼欄位，保護資訊安全
    const userObj = newUser.toObject();
    delete userObj.password;

    return userObj;
  },

  login: async (data: LoginDTO) => {
    const email = data.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email }).select('+password');

    if (!existingUser || !existingUser.password)
      throw new Error('INVALID_CREDENTIALS');

    const isMatch = await verifyPassword(data.password, existingUser.password);
    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const userResponse = existingUser.toObject();
    delete userResponse.password;

    return userResponse;
  },

  profile: async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return user;
  },

  updatePassword: async (userId: string, data: UpdatePasswordDTO) => {
    // 查找使用者
    const user = await User.findById(userId).select('+password');
    if (!user) throw new Error('USER_NOT_FOUND');

    // 如果使用者「已經有密碼」，才需要驗證舊密碼
    if (user.password) {
      if (!data.currentPassword) {
        throw new Error('CURRENT_PASSWORD_REQUIRED');
      }

      // 驗證舊密碼
      const isCorrect = await verifyPassword(
        String(data.currentPassword),
        user.password,
      );
      if (!isCorrect) throw new Error('CURRENT_PASSWORD_INVALID');

      // 檢查新密碼是否與舊的一樣
      if (data.currentPassword === data.newPassword) {
        throw new Error('NEW_PASSWORD_MUST_BE_DIFFERENT');
      }
    }

    // 加密並更新
    const hashedPassword = await hashPassword(data.newPassword);
    user.password = hashedPassword;
    await user.save();

    return user;
  },

  getMe: async (userId: string) => {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new Error('USER_NOT_FOUND');

    return user;
  },

  forgotPassword: async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('EMAIL_NOT_FOUND');

    // 產生隨機 Token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 加密 Token 存入資料庫
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 設定過期時間
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    return resetToken;
  },

  // 寄信失敗把資料庫存的 Token 欄位清空
  clearResetToken: async (email: string) => {
    await User.updateOne(
      { email },
      {
        // $unset 是 MongoDB 的指令，用來徹底移除該欄位
        $unset: {
          resetPasswordToken: 1,
          resetPasswordExpires: 1,
        },
      },
    );
  },

  resetPassword: async (token: string, newPassword: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) throw new Error('TOKEN_INVALID_OR_EXPIRED');

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return user;
  },
};
