import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import axios from "axios";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      res.status(400).json({ message: "所有欄位（名稱、信箱、密碼）皆為必填" });
      return;
    }

    // 檢查 Email 是否已被註冊
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "該電子郵件已被註冊" });
      return;
    }

    // 加密並儲存
    const newUser = new User({ name, email, password });
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
    const token = jwt.sign({ userName: user.name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // 防禦 XSS 攻擊
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 只在 https 下傳輸（開發環境先關掉）
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

    // Google 登入
    if (provider === "google") {
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: "authorization_code",
        },
      );

      const { access_token } = tokenResponse.data;

      // 用 access_token 去跟 Google 撈取使用者的 Profile 資訊
      const profileResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      email = profileResponse.data.email;
      name = profileResponse.data.name || profileResponse.data.given_name;
      providerId = profileResponse.data.id;
    }

    // Github 登入
    else if (provider === "github") {
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

      // 用 access_token 去跟 GitHub 撈取使用者的 Profile 資訊
      const profileResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      name = profileResponse.data.name || profileResponse.data.login;
      providerId = profileResponse.data.id.toString();

      // GitHub 的 Email 有可能因為隱私設定而撈不到，需要額外呼叫 Email API
      email = profileResponse.data.email;
      if (!email) {
        const emailResponse = await axios.get(
          "https://api.github.com/user/emails",
          {
            headers: { Authorization: `Bearer ${access_token}` },
          },
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

    let user = await User.findOne({ email });

    if (!user) {
      // 👉 狀況 1：資料庫完全沒這個人 ➡️ 自動幫他建立新帳號（不需 password）
      user = new User({
        name,
        email,
        providers: [{ provider, providerId }],
      });
      await user.save();
    } else {
      // 👉 狀況 2：這個人存在，檢查他是否已經綁定過這個第三方平台
      const hasProvider = user.providers.some(
        (p) => p.provider === provider && p.providerId === providerId,
      );

      if (!hasProvider) {
        // 如果他以前是用密碼註冊的，或是用 Google 註冊但現在點 GitHub
        // ➡️ 優雅地把新的第三方資訊 push 進去，實現「多平台帳號綁定」！
        user.providers.push({ provider, providerId, linkedAt: new Date() });
        await user.save();
      }
    }

    const JWT_SECRET = (process.env.JWT_SECRET ||
      "YOUR_JWT_SECRET_KEY") as string;
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 鎖進安全的 httpOnly Cookie
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
