"use client"

import RegisterForm from '@/components/RegisterForm'
import LoginForm from '@/components/LoginForm'
import ForgotPasswordForm from '@/components/ForgotPasswordForm'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import apiClient from '@/src/api/axios'

function HomeContent() {
  const [isLogin, setIsLogin] = useState(true); 
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login')
  const [isChecking, setIsChecking] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient.get("/auth/status");
        if (res.data.user) {
          // 如果已登入，直接換頁，且「不關閉」isChecking，防止表單閃現
          router.replace("/auth/success");
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        // 未登入，關閉載入狀態，顯示表單
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    // 2. 只有當 URL 明確指定為 'register' 時才顯示註冊，其餘（包含 null）維持登入
    if (mode === 'register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  if (isChecking) {
    return <div className="h-screen w-screen bg-gray-200" />; 
  }

  const config = {
    login: {
      overlayTitle: 'Welcome Back',
      overlayText: 'Enter your details and start journey with us',
      color: 'text-green-300',
      bgColor: 'bg-green-300',
      hoverColor: 'hover:text-green-300',
      btnText: 'SIGN UP',
      component: <LoginForm onForgot={() => setView('forgot')}/>
    },
    register: {
      overlayTitle: 'Create Account',
      overlayText: 'To keep connected with us please login with your info',
      color: 'text-blue-300',
      bgColor: 'bg-blue-300',
      hoverColor: 'hover:text-blue-300',
      btnText: 'SIGN IN',
      component: <RegisterForm setIsLogin={setIsLogin}/>
    },
    forgot: {
      overlayTitle: 'Reset Password',
      overlayText: 'We will send a reset link to your email',
      color: 'text-orange-300',
      bgColor: 'bg-orange-300',
      hoverColor: 'hover:text-orange-300',
      btnText: 'BACK TO LOGIN',
      component: <ForgotPasswordForm onBack={() => setView('login')}/>
    }
  };

  const current = config[view]

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-200 p-4">
      <div className={`relative w-full max-w-4xl h-[500px] flex rounded-2xl shadow-2xl overflow-hidden transition-colors duration-700 ${current.bgColor}`}>
        
        {/* --- 動態表單區域 --- */}
        <div className={`absolute top-0 w-1/2 h-full bg-white p-10 flex flex-col items-center justify-center transition-all duration-700 ${view === 'register' ? 'left-1/2' : 'left-0'}`}>
          <h1 className={`text-4xl font-sansation font-bold mb-6 transition-colors duration-700 ${current.color}`}>
            {current.overlayTitle}
          </h1>
          <div className="w-full flex flex-col items-center">
            {current.component}
          </div>
        </div>

        {/* --- 覆蓋層 (Overlay) --- */}
        <div className={`absolute top-0 w-1/2 h-full flex flex-col items-center justify-center gap-10 transition-all duration-700 z-10 ${view === 'register' ? 'left-0' : 'left-1/2'}`}>
          <h1 className="text-5xl font-sansation text-white text-center px-4">
            {current.overlayTitle}
          </h1>
          <p className="text-white text-center px-8 opacity-90">
            {current.overlayText}
          </p>
          <button
            className={`border-2 border-white rounded-full py-2 px-12 text-white font-sansation cursor-pointer text-lg font-semibold transition-all duration-300 hover:bg-white ${current.hoverColor}`}
            onClick={() => {
                if (view === 'login') setView('register'); 
                else setView('login')
              }}
          >
            {current.btnText}
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

