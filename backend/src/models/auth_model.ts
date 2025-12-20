import User from "./schema/UserSchema";

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};

export const createUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    providers: [],
  });
};
