import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword: string) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const verifyPassword = async (
  plainPassword: string,
  hashPassword: string,
) => {
  return bcrypt.compare(plainPassword, hashPassword);
};
