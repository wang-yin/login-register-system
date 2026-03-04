"use client"
import { MdOutlineEmail } from 'react-icons/md'

export default function ForgotPasswordForm({ onBack } : () => void) {
  return (
    <div className="flex flex-col gap-9 w-full items-center">
      <div className="flex items-center bg-gray-100 py-2 px-2 w-full max-w-sm">
        <MdOutlineEmail size={25} className="text-gray-500" />
        <input 
          className="px-2 w-full outline-none bg-transparent" 
          type="email" 
          placeholder="請輸入註冊的 Email" 
        />
      </div>

      <button
        className="rounded-full py-2 px-12 bg-orange-300 text-white font-sansation text-lg font-semibold hover:bg-orange-400 cursor-pointer"
        type="button"
      >
        發送重設連結
      </button>

      <button type="button" className="text-gray-400 text-sm underline hover:text-gray-500 cursor-pointer" onClick={onBack}>
        返回登入
      </button>
    </div>
  )
}