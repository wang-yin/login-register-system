"use client"
import apiClient from "@/src/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";

export default function AuthSuccess() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  const handleChangePassword = () => {
    router.push("/auth/change-password");
  }

  

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

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      router.push("/?mode=login");
    } catch (err) {
      console.error("登出失敗:", err);
      router.push("/?mode=login");
    }
  };

  if (!user) return <div className="flex justify-center items-center h-screen ">載入中...</div>;

  return(
    <div className="w-screen h-screen flex justify-center items-center bg-gray-200">
      <div className="w-3xl h-4/12  bg-white rounded-2xl shadow-lg flex items-center justify-center">
        <div>
          <p className="text-4xl">歡迎{user.name}</p>
          <div className="group flex justify-center items-center mt-20 border-2 py-2 rounded-2xl bg-white cursor-pointer hover:bg-gray-100" onClick={handleChangePassword}>
            <MdAccountCircle size={25} className="mr-2"/>
            <button className="group-hover:cursor-pointer">修改密碼</button>
          </div>
          <div className="group flex justify-center items-center mt-10 border-2 py-2 rounded-2xl bg-white cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
            <FiLogOut size={25} className="mr-2"/>
            <button className="group-hover:cursor-pointer">登出</button>
          </div>
        </div>
      </div>
    </div>
  )
}