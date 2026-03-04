import { Document } from "mongoose";

interface IProvider {
  provider: "google" | "github";
  providerId: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  providers?: IProvider[];
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
}
