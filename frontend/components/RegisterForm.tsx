'use client'

import { MdOutlineAccountCircle } from 'react-icons/md'
import { MdOutlineEmail } from 'react-icons/md'
import { TbLockPassword } from 'react-icons/tb'
import { useState } from 'react'
import apiClient from '@/src/api/axios'


interface RegisterProps {
  setIsLogin: (val: boolean) => void;
}

export default function RegisterForm({ setIsLogin }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/register", { name, email, password });
      alert("註冊成功!");
      console.log("子組件準備呼叫 setIsLogin...");
      setIsLogin(true);
      console.log("子組件呼叫完畢");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      const message = error.response?.data?.message || "註冊失敗";
      alert(message);
    }
  }

  return (
    <>
      <form className="flex flex-col gap-8 mt-15" onSubmit={handleRegister}>
        <div className="flex items-center bg-gray-100 py-2 px-2">
          <MdOutlineAccountCircle size={25} />
          <input value={name} className="px-2" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required></input>
        </div>
        <div className="flex items-center bg-gray-100 py-2 px-2">
          <MdOutlineEmail size={25} />
          <input value={email} className="px-2" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required></input>
        </div>
        <div className="flex items-center bg-gray-100 py-2 px-2">
          <TbLockPassword size={25} />
          <input
            value={password}
            className="px-2"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>
        <button
          className="rounded-full py-2 px-12 bg-blue-300 mt-4 text-white font-sansation cursor-pointer text-lg font-semibold"
          type="submit"
        >
          SIGN UP
        </button>
      </form>
    </>
  )
}
