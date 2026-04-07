import User from '../models/schema/UserSchema';
import { hashPassword, verifyPassword } from '../utils/bcrypt';
import { RegisterDTO, LoginDTO } from '../type/auth';

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
};
