import mongoose from "mongoose";

// 欄位型別，用在註冊
interface IUser {
  name: string;
  email: string;
  password: string;
  providers: {
    provider: "google" | "github";
    providerId: string;
    linkedAt: Date;
  }[];
  resetPasswordToken: string;
  resetPasswordExpires: Date;
}

// 方法型別，用在登入
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const UserSchema = new mongoose.Schema<IUser, {}, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    providers: [
      {
        provider: {
          type: String,
          required: true,
          enum: ["google", "github"],
        },
        providerId: {
          type: String,
          required: true,
        },
        linkedAt: {
          type: Date,
          default: Date.now, // 記錄他是什麼時候綁定這個第三方的
        },
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
