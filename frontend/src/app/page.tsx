'use client';

import { useState, Suspense } from 'react';
import { AUTH_CONFIG } from '@/constants/authConfig';
import { AuthView } from '@/type/auth';

function HomeContent() {
  const [view, setView] = useState<AuthView>('login');

  const current = AUTH_CONFIG[view];
  const ActiveForm = current.component;

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-200 p-4">
      <div
        className={`relative flex h-125 w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl transition-colors duration-700 ${current.bgColor}`}
      >
        {/* --- 動態表單區域 --- */}
        <div
          className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center bg-white p-10 transition-all duration-700 ${view === 'register' ? 'left-1/2' : 'left-0'}`}
        >
          <h1
            className={`font-sansation mb-6 text-4xl font-bold transition-colors duration-700 ${current.color}`}
          >
            {current.overlayTitle}
          </h1>
          <div className="flex w-full flex-col items-center">
            <ActiveForm setView={setView} />
          </div>
        </div>

        {/* --- 覆蓋層 (Overlay) --- */}
        <div
          className={`absolute top-0 z-10 flex h-full w-1/2 flex-col items-center justify-center gap-10 transition-all duration-700 ${view === 'register' ? 'left-0' : 'left-1/2'}`}
        >
          <h1 className="font-sansation px-4 text-center text-5xl text-white">
            {current.overlayTitle}
          </h1>
          <p className="px-8 text-center text-white opacity-90">
            {current.overlayText}
          </p>
          <button
            className={`font-sansation cursor-pointer rounded-full border-2 border-white px-12 py-2 text-lg font-semibold text-white transition-all duration-300 hover:bg-white ${current.hoverColor}`}
            onClick={() => {
              if (view === 'login') setView('register');
              else setView('login');
            }}
          >
            {current.btnText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
