"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OAuthButtons from "../buttons/OAuthButtons";
import Spinner from "../common/Spinner";
import api from "@/lib/api";
import axios from "axios";

interface LoginFormProps {
  onSwitch: (view: "register" | "forgot") => void;
}

export default function LoginForm({ onSwitch }: LoginFormProps) {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("請填寫所有欄位");
      return;
    }
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      if (response.status === 200) {
        const userName = response.data.user.name;
        router.push(`/dashboard?name=${encodeURIComponent(userName)}`);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "登入失敗，請稍後再試");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label htmlFor="login-email" className="text-sm text-muted-foreground">
          電子郵件
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          placeholder="you@example.com"
          autoComplete="email"
        ></input>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="login-password"
          className="text-sm text-muted-foreground"
        >
          密碼
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            placeholder="輸入密碼"
            autoComplete="current-password"
          ></input>
          <button
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          ></input>
          <div
            className={`w-5 h-5 rounded cursor-pointer border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-primary border-primary" : "border-border bg--muted group-hover:border-primary/50"}`}
          >
            {rememberMe && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-muted-foreground">記住我</span>
        </label>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={() => onSwitch("forgot")}
        >
          忘記密碼?
        </button>
      </div>
      {error && (
        <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? <Spinner /> : "登入"}
      </button>

      <OAuthButtons />

      <p className="text-center text-sm text-muted-foreground">
        還沒有帳號？{" "}
        <button
          type="button"
          className="text-primary hover:underline text-base"
          onClick={() => onSwitch("register")}
        >
          立即註冊
        </button>
      </p>
    </form>
  );
}
