"use client";

import React, { useState } from "react";
import Spinner from "../../common/Spinner";

interface VerifyStepProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function VerifyStep({ onSuccess, onBack }: VerifyStepProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleVerifyCode = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (code.length < 4) {
      setError("請輸入驗證碼");
      return;
    }
    setLoading(true);

    // API

    setLoading(false);

    if (code === "1234") {
      onSuccess();
    } else {
      setError("驗證碼錯誤，示範用請輸入 1234");
    }
  };
  return (
    <form className="space-y-5" onSubmit={handleVerifyCode}>
      <div className="px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary">
        驗證碼已寄送至 123@dsfasdf，請查收收件匣（示範碼：1234）
      </div>
      <label htmlFor="verify-code" className="text-sm text-muted-foreground">
        驗證碼
      </label>
      <div className="space-y-1">
        <input
          id="verify-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="輸入 4-6 位驗證碼"
          className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all tracking-widest text-center"
        ></input>
      </div>
      {error && <div>錯誤</div>}
      <button
        type="submit"
        disabled={loading}
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
