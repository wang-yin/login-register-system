'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { MdAccountCircle } from 'react-icons/md';
import { User } from '@/type/auth';
import apiClient from '@/api/axios';

export default function AuthSuccess() {
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      alert('您已成功登出');
      window.location.href = '/';
    } catch (error) {
      console.error('登出失敗:', error);
      alert('登出過程發生錯誤');
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await apiClient.get('/auth/getMe');
        console.log(res);
        setUserData(res.data.user);
      } catch (err) {
        router.push('/?mode=login');
      }
    };
    checkUser();
  }, [router]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-200">
      <div className="flex h-4/12 w-3xl items-center justify-center rounded-2xl bg-white shadow-lg">
        <div>
          <p className="text-4xl">歡迎 {userData.name}</p>
          <div className="group mt-20 flex cursor-pointer items-center justify-center rounded-2xl border-2 bg-white py-2 hover:bg-gray-100">
            <MdAccountCircle size={25} className="mr-2" />
            <button
              className="group-hover:cursor-pointer"
              onClick={() => {
                router.push('/auth/change-password');
              }}
            >
              {userData.hasPassword ? '修改密碼' : '設定密碼'}
            </button>
          </div>
          <div className="group mt-10 flex cursor-pointer items-center justify-center rounded-2xl border-2 bg-white py-2 hover:bg-gray-100">
            <FiLogOut size={25} className="mr-2" />
            <button
              className="group-hover:cursor-pointer"
              onClick={handleLogout}
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
