import User from '../models/schema/UserSchema';
import { hashPassword } from '../utils/bcrypt';
import { RegisterDTO } from '../type/auth';

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
};
