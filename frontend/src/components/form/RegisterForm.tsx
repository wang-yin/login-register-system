"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OAuthButtons from "../buttons/OAuthButtons";
import Spinner from "../common/Spinner";
import CheckIcon from "../icon/CheckIcon";
import api from "@/lib/api";
import axios from "axios";

interface RegisterFormProps {
  onSwitch: (view: "login") => void;
}

export default function RegisterForm({ onSwitch }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm) {
      setError("請填寫所有欄位");
      return;
    }
    if (password !== confirm) {
      setError("兩次輸入的密碼不一致");
      return;
    }
    setLoading(true);

    // API
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "註冊失敗，請稍後再試");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <CheckIcon />
        </div>
        <h2>註冊成功！</h2>

        <button
          onClick={() => onSwitch("login")}
          className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 transition-all duration-200 mt-4"
        >
          前往登入
        </button>
      </div>
    );
  }
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label htmlFor="reg-name" className="text-sm text-muted-foreground">
          姓名
        </label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            placeholder="至少 8 個字元"
            autoComplete="new-password"
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
      <div className="space-y-1">
        <label htmlFor="reg-confirm" className="text-sm text-muted-foreground">
          確認密碼
        </label>
        <input
          id="reg-confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          placeholder="再次輸入密碼"
          autoComplete="new-password"
        ></input>
        {confirm && confirm !== password && (
          <p className="text-xs text-destructive">密碼不一致</p>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? <Spinner /> : "建立帳號"}
      </button>

      <OAuthButtons />

      <p className="text-center text-sm text-muted-foreground">
        已有帳號？{" "}
        <button
          type="button"
          className="text-primary hover:underline text-base"
          onClick={() => onSwitch("login")}
        >
          立即登入
        </button>
      </p>
    </form>
  );
}
