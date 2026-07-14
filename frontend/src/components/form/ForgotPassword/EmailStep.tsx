"use client";

import React, { useState } from "react";
import Spinner from "../../common/Spinner";
import api from "@/lib/api";

interface EmailStepProps {
  email: string;
  setEmail: (val: string) => void;
  onSuccess: () => void;
}

export default function EmailStep({
  email,
  setEmail,
  onSuccess,
}: EmailStepProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("請輸入電子郵件");
      return;
    }
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      onSuccess(); // 前進到 "sent" (VerifyStep)
    } catch (err: any) {
      setError(err.response?.data?.message || "發送請求失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
    onSuccess();
  };
  return (
    <form className="space-y-5" onSubmit={handleSendCode}>
      <div>
        <p className="text-muted-foreground text-sm mb-4">
          輸入您的電子郵件，我們將發送驗證碼供您重設密碼。
        </p>
      </div>
      <div className="space-y-1">
        <label htmlFor="forgot-email" className="text-sm text-muted-foreground">
          電子郵件
        </label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          placeholder="you@example.com"
        ></input>
      </div>
      {error && <div>錯誤</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Spinner /> : "發送驗證碼"}
      </button>
    </form>
  );
}
