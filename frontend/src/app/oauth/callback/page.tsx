"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Spinner from "@/components/common/Spinner";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");

  // 用 useRef 防止 Next.js StrictMode 導致重複發送兩次請求
  const hasSentRequest = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const provider = searchParams.get("state"); // 我們在 Redirect 時把 google/github 藏在 state 裡

    if (!code || !provider) {
      setStatus("error");
      setErrorMsg("認證失敗：網址未帶有授權碼 code 或 provider 資訊");
      return;
    }

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
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(
          err.response?.data?.message || "第三方登入失敗，請稍後再試",
        );
      }
    };

    sendCodeToBackend();
  }, [searchParams, router]);

  // ========================================================
  // 🎨 根據不同的狀態渲染相對應的畫面
  // ========================================================
  return (
    <div
      className="min-height-screen flex items-center justify-center bg-background p-4"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-md text-center space-y-6">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Spinner />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              第三方安全認證中
            </h3>
            <p className="text-sm text-muted-foreground">
              正在與伺服器安全同步身分資料，請稍後...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-foreground">
              第三方認證成功！
            </h3>
            <p className="text-sm text-muted-foreground">
              歡迎回來，系統正在為您引導首頁...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-shake">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✕
            </div>
            <h3 className="text-xl font-bold text-destructive">登入失敗</h3>
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
            >
              返回登入頁面
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
