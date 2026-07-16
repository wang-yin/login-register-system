"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import ErrorStatus from "./ErrorStatus";
import SuccessStatus from "./SuccessStatus";
import LoadingStatus from "./LoadingStatus";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const code = searchParams.get("code");
  const provider = searchParams.get("state"); // 我們在 Redirect 時把 google/github 藏在 state 裡

  const isInvalid = !code || !provider;

  // 用 useRef 防止 Next.js StrictMode 導致重複發送兩次請求
  const hasSentRequest = useRef(false);

  useEffect(() => {
    if (isInvalid) return;

    if (hasSentRequest.current) return;
    hasSentRequest.current = true;

    // 執行幕後轉交：把 code 送給 Express 後端
    const sendCodeToBackend = async () => {
      try {
        const response = await api.post("/auth/oauth/callback", {
          provider, // "google" 或 "github"
          code, // 臨時號碼牌
        });

        if (response.status === 200) {
          setStatus("success");
          const userName = response.data?.user?.name;
          setTimeout(() => {
            router.push(`/dashboard?name=${encodeURIComponent(userName)}`);
          }, 3000);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setStatus("error");
          setErrorMsg(
            err.response?.data?.message || "第三方登入失敗，請稍後再試",
          );
        }
      }
    };

    sendCodeToBackend();
  }, [searchParams, router, isInvalid]);

  if (isInvalid) {
    const errorMsg = "認證失敗：網址未帶有授權碼 code 或 provider 資訊";
    return <ErrorStatus errorMsg={errorMsg} />;
  }

  // ========================================================
  // 🎨 根據不同的狀態渲染相對應的畫面
  // ========================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-md text-center space-y-6">
        {status === "loading" && <LoadingStatus />}

        {status === "success" && <SuccessStatus />}

        {status === "error" && <ErrorStatus errorMsg={errorMsg} />}
      </div>
    </div>
  );
}
