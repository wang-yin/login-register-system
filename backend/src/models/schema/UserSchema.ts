import mongoose from 'mongoose';
import { IUser } from '../../type/schema';

const UserSchema = new mongoose.Schema<IUser>(
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
          enum: ['google', 'github'],
        },
        providerId: {
          type: String,
          index: true,
        },
      },
    ],
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
