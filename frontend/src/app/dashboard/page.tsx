"use client";

import CheckIcon from "@/components/icon/CheckIcon";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Suspense, useState, useEffect } from "react";

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlName = searchParams.get("name") ?? "使用者";

  const [loading, setLoading] = useState(true);
  const [realName, setRealName] = useState(urlName);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // 頁面載入時，直接向後端驗證身分並取得最新 User 資料
        const response = await api.get("/auth/profile");

        if (response.data?.user?.name) {
          setRealName(response.data.user.name);
        }
        setLoading(false);
      } catch (err) {
        console.error("身分驗證失敗，Token 可能已失效或不存在", err);
        // 驗證失敗立刻踢回首頁/登入頁
        window.location.replace("/");
      }
    };

    verifyAuth();
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("=== 1. 點擊登出按鈕成功 ===");

    try {
      const res = await api.post("/auth/logout");
      console.log("=== 2. 後端登出回應 ===", res.data);
    } catch (err) {
      console.error("=== 登出失敗 ===", err);
      alert("登出失敗，請看 Console");
      return;
    }

    console.log("=== 3. 準備跳轉 ===");
    localStorage.clear();
    sessionStorage.clear();

    // 關鍵修改：強制導向至網站根目錄網址（自動抹除任何 ?code= 或 ?name= 等 URL 參數）
    window.location.href = window.location.origin;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">
        身份安全驗證中...
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl px-40 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
      <div className="text-center space-y-4 py-20">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <CheckIcon />
        </div>
        <h2 className="">登入成功！</h2>
        <p className="text-muted-foreground ">歡迎回來，{realName}</p>
        <div></div>
        <button
          onClick={() =>
            router.push(`/auth/edit?name=${encodeURIComponent(realName)}`)
          }
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
        >
          修改
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-primary text-sm  hover:underline"
        >
          登出並返回登入頁
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-sm text-muted-foreground">
          載入設定中...
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}
