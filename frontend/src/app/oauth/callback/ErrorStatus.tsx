"use client";

import { useRouter } from "next/navigation";

interface ErrorStatusProps {
  errorMsg: string;
}

export default function ErrorStatus({ errorMsg }: ErrorStatusProps) {
  const router = useRouter();
  return (
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
  );
}
