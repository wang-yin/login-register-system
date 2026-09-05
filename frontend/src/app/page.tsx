"use client";

import LoginForm from "@/components/form/LoginForm";
import RegisterForm from "@/components/form/RegisterForm";
import ForgotPasswordForm from "@/components/form/ForgotPassword";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type view = "login" | "register" | "forgot";

export default function Home() {
  const [view, setView] = useState<view>("login");
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLoggedStatus = async () => {
      try {
        // 建議加入 timeout 避免無限等待（例如 5 秒沒回應直接當作未登入處理）
        const response = await api.get("/auth/profile", { timeout: 5000 });

        if (response.data?.user) {
          const userName = response.data.user.name;
          router.push(`/dashboard?name=${encodeURIComponent(userName)}`);
          return; // 成功跳轉，保持 checkingAuth 為 true 避免畫面閃爍
        }
        setCheckingAuth(false);
      } catch (err) {
        console.log("驗證失敗、連線逾時或未登入：", err);
        setCheckingAuth(false); // 發生錯誤時確保取消載入狀態
      }
    };

    checkLoggedStatus();
  }, [router]);

  const titles: Record<view, { heading: string; sub: string }> = {
    login: { heading: "歡迎回來", sub: "登入您的帳號以繼續" },
    register: { heading: "建立帳號", sub: "開始您的學習旅程" },
    forgot: { heading: "重設密碼", sub: "透過電子郵件驗證來重設密碼" },
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-sm text-muted-foreground animate-pulse">
        安全驗證中，請稍後...
      </div>
    );
  }

  return (
    <div className="flex-col w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-foreground mb-1 text-2xl">
          {titles[view].heading}
        </h1>
        <p className="text-muted-foreground text-sm">{titles[view].sub}</p>
      </div>

      {/* card */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
        {/* switcher */}
        {view !== "forgot" && (
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              className={`flex-1 py-2 rounded-md text-sm transition-all duration-200 text-foreground ${
                view === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setView("login")}
            >
              登入
            </button>
            <button
              className={`flex-1 py-2 rounded-md text-sm transition-all duration-200 ${
                view === "register"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setView("register")}
            >
              註冊
            </button>
          </div>
        )}

        {view === "login" && <LoginForm onSwitch={setView} />}
        {view === "register" && <RegisterForm onSwitch={setView} />}
        {view === "forgot" && <ForgotPasswordForm onSwitch={setView} />}
      </div>
    </div>
  );
}
