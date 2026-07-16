"use client";

import { useRouter } from "next/navigation";

interface ErrorStatusProps {
  message: string;
}

export default function ErrorStatus({ message }: ErrorStatusProps) {
  const router = useRouter();
  return (
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
  );
}
