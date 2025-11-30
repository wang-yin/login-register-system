'use client'

import RegisterForm from '@/components/RegisterForm'
import LoginForm from '@/components/LoginForm'
import { useState } from 'react'

export default function Home() {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-200">
      <div
        className={`relative w-1/2 h-114 flex justify-center items-center rounded-2xl overflow-hidden  ${
          isLogin ? 'bg-green-300' : 'bg-blue-300'
        }`}
      >
        {/* --- Overlay --- */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center gap-10 transition-all duration-700  ${
            isLogin ? 'left-1/2' : 'left-0'
          }`}
        >
          <h1 className="text-6xl font-sansation text-white">
            {isLogin ? 'Hello Friend!' : 'Welcome!'}
          </h1>
          <button
            className="border-2 border-white rounded-full py-2 px-12 text-white font-sansation cursor-pointer text-lg font-semibold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'SING UP' : 'SING IN'}
          </button>
        </div>

        {/* --- RegisterForm --- */}
        <div
          className={`absolute top-0 right-0 w-1/2 bg-white p-10 flex flex-col items-center transition-all duration-700  ${
            isLogin ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <h1 className="text-4xl font-sansation text-blue-300 font-bold">
            Create Account
          </h1>
          <div className="flex flex-col items-center">
            <RegisterForm />
          </div>
        </div>

        {/* --- LoginForm --- */}
        <div
          className={`absolute top-0 left-0 w-1/2 bg-white p-10 flex flex-col items-center transition-all duration-700  ${
            isLogin ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <h1 className="text-4xl font-sansation text-green-300 font-bold">
            Welcome Back
          </h1>
          <div className="flex flex-col items-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
