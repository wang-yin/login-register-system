import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import axios from "axios";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import nodemailer from "nodemailer";

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
    const { email, password, rememberMe } = req.body;

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

    const cookieMaxAge = rememberMe
      ? 7 * 24 * 60 * 60 * 1000
      : 1 * 24 * 60 * 60 * 1000;

    // 密碼正確，簽發 JWT Token
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: rememberMe ? "7d" : "1d",
      },
    );

    // 防禦 XSS 攻擊
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: cookieMaxAge, // Cookie 有效期跟著 Token 走 (7天)
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
          redirect_uri:
            process.env.REDIRECT_URL || "http://localhost:3000/oauth/callback",
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

    // 核發 JWT 與安全 Cookie 的寫入

    const JWT_SECRET = (process.env.JWT_SECRET ||
      "YOUR_JWT_SECRET_KEY") as string;
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
      secure: true,
      sameSite: "none",
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
    const currentUserId = req.userId;

    if (!currentUserId) {
      res.status(401).json({ message: "未授權，請先登入" });
      return;
    }

    // 查資料庫，並排除敏感欄位（如 password、resetToken 等）
    const user = await User.findById(currentUserId).select(
      "-password -resetCode -resetCodeExpires",
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

// Nodemailer
const JWT_SECRET = (process.env.JWT_SECRET || "YOUR_JWT_SECRET_KEY") as string;

// 1. 初始化 Nodemailer 發信傳輸器
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as nodemailer.TransportOptions);

// ➡️ 1. 發送驗證信 API
export const sendVerificationEmail = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const currentUserId = req.userId;

    const user = await User.findById(currentUserId);
    if (!user) {
      res.status(404).json({ message: "找不到該用戶" });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ message: "該電子信箱已驗證過，無需重複驗證" });
      return;
    }

    // 產生一個專門用來驗證信箱的短效期 Token（設定 15 分鐘過期）
    const verificationToken = jwt.sign(
      { userId: user._id, type: "email-verification" },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    // 拼接前端的驗證接收頁面網址
    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

    // 2. 配置郵件內容
    const mailOptions = {
      from: `"AuthSystem" <${process.env.EMAIL_USER}>`, // 發件人
      to: user.email, // 收件人
      subject: "【驗證通知】請驗證您的電子郵件地址",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #1e3a8a;">感謝您註冊！請驗證您的電子信箱</h2>
          <p>您好，${user.name}：</p>
          <p>請點擊下方按鈕以啟用您的帳號，該連結將於 15 分鐘後過期：</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${verificationLink}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);">
              驗證電子信箱
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">如果按鈕無法點擊，請複製此網址至瀏覽器：<br/>
          <a href="${verificationLink}" style="color: #3b82f6;">${verificationLink}</a></p>
        </div>
      `,
    };

    // 3. 執行發信
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "驗證信已成功發送，請至信箱查收" });
  } catch (error: any) {
    console.error("Nodemailer 發送驗證信失敗:", error);
    res.status(500).json({ message: "發送郵件失敗，請稍後再試" });
  }
};

// 驗證 Token 並開通帳號 API
export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ message: "缺少驗證憑證 (Token)" });
      return;
    }

    // 解碼驗證 Token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        res
          .status(400)
          .json({ message: "驗證連結已過期，請重新申請發送驗證信" });
        return;
      }
      res.status(400).json({ message: "無效或損毀的驗證連結" });
      return;
    }

    if (decoded.type !== "email-verification") {
      res.status(400).json({ message: "無效的驗證類型" });
      return;
    }

    // 尋找用戶並將狀態更新為 true
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: "找不到對應的用戶" });
      return;
    }

    if (user.isEmailVerified) {
      res.status(200).json({ message: "信箱先前已驗證成功！" });
      return;
    }

    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({
      message: "信箱驗證成功！帳號已全面開通",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("驗證信箱發生錯誤:", error);
    res.status(500).json({ message: "伺服器內部錯誤" });
  }
};

// forgotPassword
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "請輸入電子信箱" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(200).json({ message: "若該信箱已註冊，重設密碼信件已發送" });
      return;
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 存入資料庫，設定 15 分鐘過期
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // 發信
    await transporter.sendMail({
      from: `"AuthSystem" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "【安全驗證】您的密碼重設驗證碼",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #1e3a8a; margin-bottom: 10px;">重設您的帳號密碼</h2>
          <p style="color: #374151; font-size: 14px;">您好：</p>
          <p style="color: #374151; font-size: 14px; line-height: 1.5;">我們收到了您重設密碼的請求。請在網頁上輸入下方的 6 位數驗證碼：</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f3f4f6; color: #1e3a8a; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 15px 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
              ${resetCode}
            </span>
          </div>
          <p style="color: #ef4444; font-size: 12px; font-weight: bold;">該驗證碼將於 15 分鐘後失效。如果您並未要求重設密碼，請忽略此郵件。</p>
        </div>
      `,
    });

    res.status(200).json({ message: "若該信箱已註冊，重設密碼信件已發送" });
  } catch (error) {
    console.error("忘記密碼發信失敗:", error);
    res.status(500).json({ message: "伺服器內部錯誤" });
  }
};

export const verifyResetCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: "請輸入電子信箱與驗證碼" });
      return;
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetCode: code,
      resetCodeExpires: { $gt: new Date() }, // 必須大於當前時間（未過期）
    });

    if (!user) {
      res.status(400).json({ message: "驗證碼錯誤或已過期" });
      return;
    }

    // 驗證成功，產生一個短效（10 分鐘）的 JWT 給前端，作為修改新密碼的「門票」
    const resetToken = jwt.sign(
      { userId: user._id, type: "reset-password" },
      JWT_SECRET,
      { expiresIn: "10m" },
    );

    // 清除資料庫中的驗證碼防止重複使用
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.status(200).json({
      message: "驗證碼審核成功",
      resetToken, // 👈 把這張門票交給前端
    });
  } catch (error) {
    res.status(500).json({ message: "伺服器內部錯誤" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ message: "缺少必要參數" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: "新密碼至少需要 8 個字元" });
      return;
    }

    // 驗證 Token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
      res.status(400).json({ message: "重設連結已過期或無效，請重新申請" });
      return;
    }

    if (decoded.type !== "reset-password") {
      res.status(400).json({ message: "無效的驗證類型" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: "找不到該用戶" });
      return;
    }

    // 直接賦予新密碼，Mongoose pre("save") Hook 會自動幫我們做 bcrypt 雜湊加密
    user.password = password;
    await user.save();

    res.status(200).json({ message: "密碼重設成功！請使用新密碼登入" });
  } catch (error) {
    console.error("重設密碼失敗:", error);
    res.status(500).json({ message: "伺服器內部錯誤" });
  }
};
