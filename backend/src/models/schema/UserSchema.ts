import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
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
