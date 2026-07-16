"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import SuccessStatus from "./SuccessStatus";
import LoadingStatus from "./LoadingStatus";
import ErrorStatus from "./ErrorStatus";
import axios from "axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const isInvalidToken = !token;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    isInvalidToken ? "error" : "loading",
  );
  const [message, setMessage] = useState(
    isInvalidToken
      ? "缺少驗證憑證 (Token)，請重新從驗證信連結進入。"
      : "正在驗證您的電子信箱，請稍候...",
  );

  // 使用 useRef 防止 React 18 StrictMode 在開發環境下觸發兩次 API 請求
  const hasCalledApi = useRef(false);

  useEffect(() => {
    // 檢查網址列有沒有 token
    if (isInvalidToken) return;

    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    // 將 Token 送回後端驗證 API
    const verifyToken = async () => {
      try {
        const response = await api.post("/auth/verify-email", { token });

        setStatus("success");
        setMessage(response.data.message || "信箱驗證成功！");

        const updatedUser = response.data.user;
        const nameParam = updatedUser?.name
          ? `?name=${encodeURIComponent(updatedUser.name)}`
          : "";

        // 驗證成功後，3 秒後自動導回控制面板（此時後端資料庫 isEmailVerified 已經是 true 了）
        setTimeout(() => {
          router.push(`/dashboard${nameParam}`);
        }, 3000);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setStatus("error");
          setMessage(
            err.response?.data?.message || "驗證失敗，連結可能已失效或過期。",
          );
        }
      }
    };

    verifyToken();
  }, [token, router, isInvalidToken]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] w-full max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">電子信箱認證</h2>

        {/* 載入中 */}
        {status === "loading" && <LoadingStatus message={message} />}

        {/* 驗證成功 */}
        {status === "success" && <SuccessStatus message={message} />}

        {/* 驗證失敗 */}
        {status === "error" && <ErrorStatus message={message} />}
      </div>
    </div>
  );
}
