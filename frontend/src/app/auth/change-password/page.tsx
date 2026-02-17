"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/src/api/axios";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.put("/auth/change-password", { oldPassword, newPassword });
      if(res.status === 200) {
        alert("密碼修改成功，請重新登入");
        router.push("/?mode=login");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "修改失敗");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">修改密碼</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="舊密碼" 
            className="border p-3 rounded-lg"
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="新密碼" 
            className="border p-3 rounded-lg"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {message && <p className="text-red-500 text-sm">{message}</p>}
          <div className="flex gap-2 mt-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="flex-1 border py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              取消
            </button>
            <button 
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              確認修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}