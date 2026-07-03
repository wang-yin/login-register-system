"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OAuthButtons from "../buttons/OAuthButtons";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="reg-name" className="text-sm text-muted-foreground">
          姓名
        </label>
        <input
          id="reg-name"
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          placeholder="你的名字"
          autoComplete="name"
        ></input>
      </div>
      <div className="space-y-1">
        <label htmlFor="reg-email" className="text-sm text-muted-foreground">
          電子郵件
        </label>
        <input
          id="reg-email"
          type="email"
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          placeholder="you@example.com"
          autoComplete="email"
        ></input>
      </div>
      <div className="space-y-1">
        <label htmlFor="reg-password" className="text-sm text-muted-foreground">
          密碼
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            placeholder="至少 8 個字元"
            autoComplete="new-password"
          ></input>
          <button
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="reg-confirm" className="text-sm text-muted-foreground">
          確認密碼
        </label>
        <input
          id="reg-confirm"
          type="password"
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          placeholder="再次輸入密碼"
          autoComplete="new-password"
        ></input>
      </div>

      <OAuthButtons />

      <p className="text-center text-sm text-muted-foreground">
        已有帳號？{" "}
        <button
          type="button"
          className="text-primary hover:underline text-base"
        >
          立即登入
        </button>
      </p>
    </form>
  );
}
