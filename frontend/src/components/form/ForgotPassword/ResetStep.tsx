"use client";

import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface ResetStepProps {
  onSuccess: () => void;
}

export default function ResetStep({ onSuccess }: ResetStepProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!newPassword || !confirmPassword) {
      setError("請填寫所有欄位");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("兩次輸入的密碼不一致");
      return;
    }
    if (newPassword.length < 8) {
      setError("密碼至少需要 8 個字元");
      return;
    }
    setLoading(true);
    // API

    setLoading(false);
    onSuccess();
  };
  return (
    <form className="space-y-5" onSubmit={handleReset}>
      <p className="text-muted-foreground text-sm">請設定您的新密碼</p>
      <div className="space-y-1">
        <label htmlFor="new-password" className="text-sm text-muted-foreground">
          新密碼
        </label>
        <div className=" relative">
          <input
            type={showPassword ? "text" : "password"}
            id="new-password"
            placeholder="至少 8 個字元"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          ></input>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="confirm-new-password"
          className="text-sm text-muted-foreground"
        >
          確認新密碼
        </label>

        <input
          type={showPassword ? "text" : "password"}
          id="confirm-new-password"
          placeholder="再次輸入新密碼"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 pr-12 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        ></input>
      </div>
      {error && <div>錯誤</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
      >
        重設密碼
      </button>
    </form>
  );
}
