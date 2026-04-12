import User from '../models/schema/UserSchema';
import { hashPassword, verifyPassword } from '../utils/bcrypt';
import { RegisterDTO, LoginDTO, UpdatePasswordDTO } from '../types/auth';

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
};
