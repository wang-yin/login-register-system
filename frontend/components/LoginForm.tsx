"use client"

import SocialButtons from '@/components/SocialButtons'
import { MdOutlineEmail } from 'react-icons/md'
import { TbLockPassword } from 'react-icons/tb'
import { useState } from 'react'
import apiClient from '@/src/api/axios'
import { useRouter } from 'next/navigation'


export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/login", { email, password });
      
      alert("登入成功！")
      router.push("/auth/success");
    } catch (error: any) {
      alert(error.response?.data?.message || "登入失敗");
    }
  }
  return (
    <>
      <div className="flex gap-5 my-5">
        <SocialButtons />
      </div>
      <form className="flex flex-col gap-9" onSubmit={handleLogin}>
        <div className="flex items-center bg-gray-100 py-2 px-2">
          <MdOutlineEmail size={25} />
          <input className="px-2" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required></input>
        </div>
        <div className="flex items-center bg-gray-100 py-2 px-2">
          <TbLockPassword size={25} />
          <input
            className="px-2"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>
        <div className="flex gap-5 ">
          <label className="flex gap-2 cursor-pointer" htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              className="cursor-pointer"
            ></input>
            <span>Remember me</span>
          </label>
          <a
            href="https://example.com"
            className="text-blue-500 hover:text-blue-600"
          >
            Forgot password
          </a>
        </div>
        <button
          className="rounded-full py-2 px-12 bg-green-300  text-white font-sansation cursor-pointer text-lg font-semibold"
          type="submit"
        >
          SIGN IN
        </button>
      </form>
    </>
  )
}
