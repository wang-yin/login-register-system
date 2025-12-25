import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: any) {
        return !this.providers || this.providers.length === 0;
      },
      select: false,
    },
    providers: [
      {
        provider: {
          type: String,
          enum: ["google", "github"],
        },
        providerId: {
          type: String,
          index: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
