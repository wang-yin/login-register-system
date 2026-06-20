import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserSchema } from "./schema/UserSchema";

// 儲存前的「自動加密」邏輯
UserSchema.pre("save", async function () {
  const user = this;

  // 如果密碼沒有被建立或修改，就直接 return 結束
  if (!user.isModified("password") || !user.password) {
    return;
  }

  //  加密，Mongoose 會自動執行存檔
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);
});

// 登入時的「解密/比對」邏輯
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this;

  // 如果是純 OAuth 註冊的人，資料庫不會有 password
  if (!user.password) {
    return false;
  }

  return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
