import User from "./schema/UserSchema";
import { RegisterInput } from "../types/auth";
import { hashPassword } from "../utils/bcrypt";

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("使用者已存在");
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return newUser;
};
