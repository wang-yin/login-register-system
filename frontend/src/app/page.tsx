'use client'

import RegisterForm from '@/components/RegisterForm'
import LoginForm from '@/components/LoginForm'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function HomeContent() {
  const [isLogin, setIsLogin] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'login') setIsLogin(true);
    else if (mode === 'register') setIsLogin(false);
  }, [searchParams]);

  // 配置物件：將變動的部分抽離，讓 HTML 結構變得很乾淨
  const config = {
    login: {
      title: 'Welcome Back',
      color: 'text-green-300',
      side: 'left-0',
      component: <LoginForm />
    },
    register: {
      title: 'Create Account',
      color: 'text-blue-300',
      side: 'right-0',
      component: <RegisterForm setIsLogin={setIsLogin}/>
    }
  };

  const current = isLogin ? config.login : config.register;

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-200 p-4">
      <div className={`relative w-full max-w-4xl h-[500px] flex rounded-2xl shadow-2xl overflow-hidden transition-colors duration-700 ${isLogin ? 'bg-green-300' : 'bg-blue-300'}`}>
        
        {/* --- 動態表單區域 --- */}
        <div className={`absolute top-0 w-1/2 h-full bg-white p-10 flex flex-col items-center justify-center transition-all duration-700 ${isLogin ? 'left-0' : 'left-1/2'}`}>
          <h1 className={`text-4xl font-sansation font-bold mb-6 transition-colors duration-700 ${current.color}`}>
            {current.title}
          </h1>
          <div className="w-full flex flex-col items-center">
            {current.component}
          </div>
        </div>

        {/* --- 覆蓋層 (Overlay) --- */}
        <div className={`absolute top-0 w-1/2 h-full flex flex-col items-center justify-center gap-10 transition-all duration-700 z-10 ${isLogin ? 'left-1/2' : 'left-0'}`}>
          <h1 className="text-5xl font-sansation text-white text-center px-4">
            {isLogin ? 'Hello Friend!' : 'Welcome!'}
          </h1>
          <p className="text-white text-center px-8 opacity-90">
            {isLogin ? 'Enter your details and start journey with us' : 'To keep connected with us please login with your info'}
          </p>
          <button
            className={`border-2 border-white rounded-full py-2 px-12 text-white font-sansation cursor-pointer text-lg font-semibold transition-all duration-300 ${
              isLogin ? 'hover:bg-white hover:text-green-300' : 'hover:bg-white hover:text-blue-300'
            }`}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'SIGN UP' : 'SIGN IN'}
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}