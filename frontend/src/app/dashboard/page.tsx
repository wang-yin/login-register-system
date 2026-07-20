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
        // 頁面載入時，立刻向後端索取當前登入者資料
        const response = await api.get("/auth/profile");

        // 如果後端驗證成功，把真實的名字存下來
        if (response.data?.user?.name) {
          setRealName(response.data.user.name);
        }
        setLoading(false);
      } catch (err) {
        console.error("身份驗證失敗，Token 可能已失效或不存在", err);
        // 驗證失敗（沒 token 或過期），立刻強行踢回首頁/登入頁
        window.location.href = "/";
      }
    };

    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("登出失敗", err);
    } finally {
      // 登出改用硬跳轉，徹底清洗 Next.js 前端快取與記憶體狀態
      window.location.href = "/";
    }
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
