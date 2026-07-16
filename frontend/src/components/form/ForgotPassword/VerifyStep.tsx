"use client";

import React, { useState } from "react";
import Spinner from "../../common/Spinner";
import api from "@/lib/api";
import axios from "axios";

interface VerifyStepProps {
  email: string;
  setResetToken: (token: string) => void;
  onSuccess: () => void;
  onBack: () => void;
}

export default function VerifyStep({
  email,
  setResetToken,
  onSuccess,
  onBack,
}: VerifyStepProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("驗證碼格式不正確，請輸入 6 位數字");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/verify-reset-code", {
        email,
        code: code.trim(),
      });

      // 儲存後端發過來的改密碼門票 (resetToken)
      setResetToken(response.data.resetToken);
      onSuccess(); // 前進到 "reset"
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "驗證失敗，驗證碼可能錯誤或過期",
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary">
        驗證碼已寄送至 <strong>{email}</strong>，請查收收件匣
      </div>
      <label htmlFor="verify-code" className="text-sm text-muted-foreground">
        驗證碼
      </label>
      <div className="space-y-1">
        <input
          id="verify-code"
          maxLength={6}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          disabled={loading}
          placeholder="輸入驗證碼"
          required
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all tracking-widest text-center"
        ></input>
      </div>
      {error && (
        <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Spinner /> : "驗證"}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        重新發送
      </button>
    </form>
  );
}
