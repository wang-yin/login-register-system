"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Spinner from "@/components/common/Spinner";
import SuccessStatus from "./SuccessStatus";
import api from "@/lib/api";
import axios from "axios";
import { Suspense } from "react";

interface UserProfile {
  name: string;
  email: string;
  isEmailVerified: boolean;
}

function EditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 基礎狀態管理
  const currentName = searchParams.get("name") || "使用者";
  const [name, setName] = useState(currentName);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [email, setEmail] = useState("");

  // 異步與提示狀態
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/profile"); // 確保後端有這支獲取當前用戶的 API
        const userData: UserProfile = response.data.user;

        setName(userData.name);
        setEmail(userData.email);
        setIsEmailVerified(userData.isEmailVerified);
      } catch (err: unknown) {
        let finalErrorMsg = "登入憑證失效，請重新登入";
        if (axios.isAxiosError(err)) {
          finalErrorMsg = err.response?.data?.message || finalErrorMsg;
        }
        setErrorMsg(finalErrorMsg);
        setTimeout(() => router.push("/"), 2000);
      } finally {
        setPageLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleCancel = () => {
    router.push(`/dashboard?name=${encodeURIComponent(name || currentName)}`);
  };

  const handleSendVerification = async () => {
    setVerifyLoading(true);
    setErrorMsg("");
    try {
      // 假設後端發送驗證信路由為 /auth/send-verification
      await api.post("/auth/send-verification");
      setSuccessMsg("驗證信已發送至您的信箱，請查收！");
      setTimeout(() => setSuccessMsg(""), 5000); // 5秒後自動隱藏成功訊息
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorMsg(
          err.response?.data?.message || "發送驗證信失敗，請稍後再試",
        );
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("名字不能為空");
      return;
    }

    const updateData: { name: string; password?: string } = {
      name: name.trim(),
    };

    const isPasswordChanged = !!password;

    if (isPasswordChanged) {
      if (password.length < 8) {
        setErrorMsg("新密碼至少需要 8 個字元");
        return;
      }
      if (password !== confirm) {
        setErrorMsg("確認密碼與新密碼不一致");
        return;
      }
      updateData.password = password;
    }

    setLoading(true);
    try {
      const response = await api.put("/auth/update", updateData);

      if (response.status === 200) {
        setIsSuccess(true);
        if (isPasswordChanged) {
          // 有改密碼 > 呼叫後端登出 API 清除 Cookie Token，然後回首頁(登入頁)
          setTimeout(async () => {
            try {
              await api.post("/auth/logout"); // 呼叫你的登出路由，讓後端清除 token cookie
            } catch (logoutErr) {
              console.error("嘗試自動登出失敗", logoutErr);
            } finally {
              router.push("/"); // 強制導回登入首頁
            }
          }, 3000);
        } else {
          // 沒改密碼（只有改名字）> 直接帶著新名字回 Dashboard
          setTimeout(() => {
            router.push(
              `/dashboard?name=${encodeURIComponent(updateData.name)}`,
            );
          }, 3000);
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorMsg(err.response?.data?.message || "資料更新失敗，請稍後再試");
      }
    } finally {
      setLoading(false);
    }
  };

  // 全頁初始化載入中
  if (pageLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 shadow-md flex flex-col items-center justify-center min-h-100">
        <Spinner />
        <p className="text-sm text-muted-foreground mt-4">
          安全載入帳號資料中...
        </p>
      </div>
    );
  }

  // 成功提交後的畫面切換
  if (isSuccess) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
        <SuccessStatus message="資料修改成功！正在為您引導回控制面板..." />
      </div>
    );
  }
  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] w-full max-w-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-foreground mb-2 text-center">
          帳號設定
        </h2>

        {/* 錯誤與提示訊息顯示 */}
        {errorMsg && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm text-center">
            {successMsg}
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="change-name"
            className="text-sm text-muted-foreground"
          >
            名字
          </label>
          <input
            id="change-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="你的名字"
            autoComplete="name"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-muted-foreground block">
            電子信箱
          </label>
          <div className="flex items-center gap-3 bg-muted border border-border px-4 py-3 rounded-lg text-muted-foreground text-sm">
            <span className="truncate flex-1">{email || "載入中..."}</span>

            {isEmailVerified ? (
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2.5 py-1 rounded-md font-medium shrink-0">
                已認證
              </span>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-md font-medium">
                  未認證
                </span>
                <button
                  type="button"
                  disabled={verifyLoading}
                  onClick={handleSendVerification}
                  className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/90 disabled:opacity-50 transition-all font-medium"
                >
                  {verifyLoading ? "發送中..." : "啟動認證"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="reg-password"
            className="text-sm text-muted-foreground"
          >
            新密碼 (若不修改請留空)
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="至少 8 個字元"
              autoComplete="new-password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="reg-confirm"
            className="text-sm text-muted-foreground"
          >
            確認新密碼
          </label>
          <input
            id="reg-confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="再次輸入密碼"
            autoComplete="new-password"
          />
          {confirm && confirm !== password && (
            <p className="text-xs text-destructive mt-1">密碼不一致</p>
          )}
        </div>

        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Spinner /> : "確認修改"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleCancel}
            className="w-full py-3 rounded-lg bg-red-400/20 text-red-400 border border-red-400/30 hover:bg-red-400/30 font-medium disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            返回
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Edit() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-sm text-muted-foreground">
          載入設定中...
        </div>
      }
    >
      <EditContent />
    </Suspense>
  );
}
