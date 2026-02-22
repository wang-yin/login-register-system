import { findUserByEmail, createUser } from "../models/auth_model";
import { RegisterInput, LoginInput } from "../types/auth";
import { hashPassword, verifyPassword } from "../utils/bcrypt";

export const registerUser = async (data: RegisterInput) => {
  const user = await findUserByEmail(data.email);
  if (user) {
    throw new Error("使用者已存在");
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = await createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return newUser;
};

export const loginUser = async (data: LoginInput) => {
  const user = await findUserByEmail(data.email);
  if (!user || !user.password) {
    throw new Error("帳號密碼錯誤");
  }

  const isMatch = await verifyPassword(data.password, user.password);
  if (!isMatch) {
    throw new Error("帳號密碼錯誤");
  }

  return user;
};

export const changePassword = async (
  oldPassword: String,
  newPassword: String,
) => {};
