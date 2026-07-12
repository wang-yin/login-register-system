import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import axios from "axios";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
      res.status(400).json({ message: "所有欄位（名稱、信箱、密碼）皆為必填" });
      return;
    }

    const normalizedEmail = email.toLowerCase();

    // 檢查 Email 是否已被註冊
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      // 只要有人用了就不能註冊，因為該帳號即使沒驗證，持有者也是可以登入使用的
      res.status(400).json({ message: "該電子郵件已被註冊" });
      return;
    }

    // 正常建立，isEmailVerified 預設為 false，讓他登入後自己去點驗證
    const newUser = new User({
      name,
      email: normalizedEmail,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "註冊成功！" });
  } catch (error: any) {
    console.error("註冊發生錯誤:", error);
    res.status(500).json({ message: "伺服器內部錯誤，請稍後再試" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "電子郵件與密碼皆為必填" });
      return;
    }

    // 尋找使用者是否存在
    const user = await User.findOne({ email });
    if (!user) {
      res.clearCookie("token");
      res.status(401).json({ message: "電子郵件或密碼錯誤" });
      return;
    }

    // 比對密碼
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.clearCookie("token");
      res.status(401).json({ message: "電子郵件或密碼錯誤" });
      return;
    }

    // 密碼正確，簽發 JWT Token
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // 防禦 XSS 攻擊
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 只在 https 下傳輸（開發環境先關掉）
      sameSite: "lax", // 防禦 CSRF 攻擊
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie 有效期跟著 Token 走 (7天)
    });

    res.status(200).json({
      message: "登入成功！",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("登入出錯了：", error);
    res.status(500).json({ message: "伺服器錯誤，請稍後再試" });
  }
};

export const oauthLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { provider, code } = req.body;

    if (!provider || !code) {
      res.status(400).json({ message: "缺少必要參數 provider 或 code" });
      return;
    }

    let email = "";
    let name = "";
    let providerId = "";

    // ==========================================
    // 1. 第三方平台 Token 換取與 Profile 撈取
    // ==========================================
    if (provider === "google") {
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "http://localhost:3000/oauth/callback",
          grant_type: "authorization_code",
        },
      );

      const { access_token } = tokenResponse.data;

      const profileResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } },
      );
      email = profileResponse.data.email;
      name = profileResponse.data.name || profileResponse.data.given_name;
      providerId = profileResponse.data.id;
    } else if (provider === "github") {
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        { headers: { Accept: "application/json" } },
      );

      const { access_token } = tokenResponse.data;

      const profileResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      name = profileResponse.data.name || profileResponse.data.login;
      providerId = profileResponse.data.id.toString();

      email = profileResponse.data.email;
      if (!email) {
        const emailResponse = await axios.get(
          "https://api.github.com/user/emails",
          { headers: { Authorization: `Bearer ${access_token}` } },
        );
        const primaryEmailObj =
          emailResponse.data.find((e: any) => e.primary) ||
          emailResponse.data[0];
        email = primaryEmailObj?.email;
      }
    } else {
      res.status(400).json({ message: "不支援的第三方登入平台" });
      return;
    }

    if (!email) {
      res.status(400).json({ message: "無法從第三方平台取得電子郵件資訊" });
      return;
    }

    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // 👉 狀況 1：全新的帳號 ➡️ 直接建立，預設已驗證
      user = new User({
        name,
        email: normalizedEmail,
        isEmailVerified: true,
        providers: [{ provider, providerId, linkedAt: new Date() }],
      });
      await user.save();
      console.log("儲存後的用戶資料：", user);
    } else {
      // 👉 狀況 2：帳號已存在（可能是傳統註冊進來的，且還沒驗證信箱）
      // ➡️ 既然他能透過 Google 登入這個信箱，代表他就是主人，直接幫他把信箱改為「已驗證」！
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
      }

      // 檢查是否已經綁定過目前這個 provider
      const hasProvider = user.providers.some(
        (p) => p.provider === provider && p.providerId === providerId,
      );

      if (!hasProvider) {
        // 塞入第三方綁定陣列，完成合併
        user.providers.push({ provider, providerId, linkedAt: new Date() });
      }

      await user.save();
    }

    // ==========================================
    // 3. 核發 JWT 與安全 Cookie 的寫入
    // ==========================================
    const JWT_SECRET = (process.env.JWT_SECRET ||
      "YOUR_JWT_SECRET_KEY") as string;
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `${provider === "google" ? "Google" : "GitHub"} 登入成功！`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("OAuth 登入失敗：", error.response?.data || error.message);
    res.status(500).json({ message: "第三方登入伺服器錯誤" });
  }
};

// logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // 開發環境先關掉（保持與 login 設定一致）
      sameSite: "lax",
    });

    res.status(200).json({ message: "登出成功！" });
  } catch (error: any) {
    console.error("登出出錯了：", error);
    res.status(500).json({ message: "伺服器錯誤，請稍後再試" });
  }
};

// getProfile
export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = (req as any).userId;

    if (!currentUserId) {
      res.status(401).json({ message: "未授權，請先登入" });
      return;
    }

    // 查資料庫，並排除敏感欄位（如 password、resetToken 等）
    const user = await User.findById(currentUserId).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    if (!user) {
      res.status(404).json({ message: "找不到該用戶的資料" });
      return;
    }

    // 回傳給前端，格式要與前端定義的 UserProfile interface 對齊
    res.status(200).json({
      message: "獲取用戶資料成功",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        providers: user.providers, // 如果前端需要顯示綁定了哪些平台，也可以一併回傳
      },
    });
  } catch (error: any) {
    console.error("獲取當前用戶失敗:", error);
    res.status(500).json({ message: "伺服器內部錯誤" });
  }
};

// update
export const updateProfileOrPassword = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { name, password } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ message: "名字不能為空" });
      return;
    }

    // 尋找該用戶
    const user = await User.findById(currentUserId);
    if (!user) {
      res.status(404).json({ message: "找不到該用戶" });
      return;
    }

    // 更新名稱
    user.name = name.trim();

    // 如果前端有傳送密碼過來，才進行密碼更新
    if (password) {
      if (password.length < 8) {
        res.status(400).json({ message: "新密碼至少需要 8 個字元" });
        return;
      }
      user.password = password;
    }

    // 儲存至資料庫
    await user.save();

    // 回傳成功回應給前端
    res.status(200).json({
      message: "資料修改成功！",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("更新帳號資料失敗:", error);
    res.status(500).json({ message: "伺服器內部錯誤，請稍後再試" });
  }
};
