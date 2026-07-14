"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/common/Spinner";
import api from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("正在驗證您的電子信箱，請稍候...");

  // 🌟 使用 useRef 防止 React 18 StrictMode 在開發環境下觸發兩次 API 請求
  const hasCalledApi = useRef(false);

  useEffect(() => {
    // 1. 檢查網址列有沒有 token
    if (!token) {
      setStatus("error");
      setMessage("缺少驗證憑證 (Token)，請重新從驗證信連結進入。");
      return;
    }

    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    // 2. 將 Token 送回後端驗證 API
    const verifyToken = async () => {
      try {
        // 呼叫我們在後端寫好的公開路由 POST /auth/verify-email
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
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "驗證失敗，連結可能已失效或過期。",
        );
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] w-full max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">電子信箱認證</h2>

        {/* 狀態 A：載入中 */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <Spinner />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}

        {/* 狀態 B：驗證成功 */}
        {status === "success" && (
          <div className="py-6 space-y-3">
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
              {message}
            </div>
            <p className="text-xs text-muted-foreground">
              正在為您引導回控制面板...
            </p>
          </div>
        )}

        {/* 狀態 C：驗證失敗 */}
        {status === "error" && (
          <div className="py-6 space-y-4">
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
              {message}
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all text-sm"
            >
              返回主頁面
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
