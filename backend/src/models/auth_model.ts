import User from "./schema/UserSchema";

export const findUserByEmail = (email: string) => {
  return User.findOne({ email }).select("+password");
};

export const findById = (id: string) => {
  return User.findById(id).select("-password");
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

// 第三方登入用
export const findUserByProviderId = (provider: string, providerId: string) => {
  return User.findOne({
    "providers.provider": provider,
    "providers.providerId": providerId,
  });
};

export const createOAuthUser = (data: {
  name: string;
  email: string;
  provider: "google" | "github";
  providerId: string;
}) => {
  return User.create({
    name: data.name,
    email: data.email,
    providers: [{ provider: data.provider, providerId: data.providerId }],
  });
};

export const addProviderToUser = (
  userId: string,
  provider: string,
  providerId: string
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: { providers: { provider, providerId } },
    },
    { new: true }
  );
};
