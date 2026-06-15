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

const User = mongoose.model("User", UserSchema);
export default User;
