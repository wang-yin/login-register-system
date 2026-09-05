"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import ErrorStatus from "./ErrorStatus";
import SuccessStatus from "./SuccessStatus";
import LoadingStatus from "./LoadingStatus";
import { Suspense } from "react";

function OAuthCallbackPageContent() {
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

    const sendCodeToBackend = async () => {
      try {
        // 加上 8 秒 Timeout，避免第三方換 Token 或後端處理時無限卡死
        const response = await api.post(
          "/auth/oauth/callback",
          { provider, code },
          { timeout: 8000 },
        );

        if (response.status === 200) {
          setStatus("success");
          const userName = response.data?.user?.name;
          setTimeout(() => {
            router.push(
              `/dashboard?name=${encodeURIComponent(userName || "")}`,
            );
          }, 2000);
        }
      } catch (err: unknown) {
        setStatus("error");
        if (axios.isAxiosError(err)) {
          if (err.code === "ECONNABORTED") {
            setErrorMsg("伺服器回應超時，請檢查後端服務是否正常後重試");
          } else {
            setErrorMsg(
              err.response?.data?.message || "第三方登入驗證失敗，請重新登入",
            );
          }
        } else {
          setErrorMsg("發生未知錯誤，請稍後再試");
        }
      }
    };

    sendCodeToBackend();
  }, [isInvalid, code, provider, router]);

  if (isInvalid) {
    const errorMsg = "認證失敗：網址未帶有授權碼 code 或 provider 資訊";
    return <ErrorStatus errorMsg={errorMsg} />;
  }

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

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-sm text-muted-foreground">
          載入設定中...
        </div>
      }
    >
      <OAuthCallbackPageContent />
    </Suspense>
  );
}
