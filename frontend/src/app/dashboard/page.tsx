"use client";

import CheckIcon from "@/components/icon/CheckIcon";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("登出失敗", err);
    } finally {
      // 無論後端成功與否，前端都強制跳轉回登入頁
      router.push("/");
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-30 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <CheckIcon />
        </div>
        <h2>登入成功！</h2>
        <p className="text-muted-foreground">歡迎回來，{name}</p>
        <button
          onClick={() =>
            router.push(`/auth/edit?name=${encodeURIComponent(name)}`)
          }
          className="w-full text-primary text-sm hover:underline"
        >
          修改
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-primary text-sm hover:underline"
        >
          登出並返回登入頁
        </button>
      </div>
    </div>
  );
}
