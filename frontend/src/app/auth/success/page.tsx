"use client"
import apiClient from "@/src/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";

export default function AuthSuccess() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await apiClient.get("/auth/status");
        setUser(res.data.user)
      } catch (err) {
        router.push("/?mode=login");
      }
    };
    checkUser();
  }, [router])

  if (!user) return <div className="flex justify-center items-center h-screen">載入中...</div>;

  return(
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-3xl h-4/12  bg-amber-200 rounded-2xl flex items-center justify-center">
        <div>
          <p className="text-4xl">歡迎{user.name}，登入</p>
          <div className="group flex justify-center items-center mt-20 border-2 py-2 rounded-2xl bg-white cursor-pointer hover:bg-gray-100">
            <FiLogOut />
            <button className="group-hover:cursor-pointer">登出</button>
          </div>
        </div>
      </div>
    </div>
  )
}