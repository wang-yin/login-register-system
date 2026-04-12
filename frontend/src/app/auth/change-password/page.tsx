'use client';

import apiClient from '@/api/axios';
import { useRouter } from 'next/navigation';
import { User } from '@/type/auth';
import { useEffect, useState } from 'react';

export default function ChangePassword() {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await apiClient.get('/auth/getMe');
        setUserData(res.data.user);
      } catch (err) {
        router.push('/?mode=login');
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);

    try {
      const res = await apiClient.patch('/auth/update-password', data);
      if (res.status === 200) {
        alert(
          userData?.hasPassword ? '密碼修改成功，請重新登入' : '密碼設定成功！',
        );
        router.push('/');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || '操作失敗';
      alert(message);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">驗證中...</div>
    );
  if (!userData) return null;

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {userData.hasPassword ? '修改密碼' : '設定初始密碼'}
        </h1>
        <form className="flex flex-col gap-4" action={handleSubmit}>
          {userData.hasPassword && (
            <input
              type="password"
              name="currentPassword"
              placeholder="目前舊密碼"
              className="rounded-lg border p-3"
              required
            />
          )}
          <input
            type="password"
            name="newPassword"
            placeholder={userData.hasPassword ? '新密碼' : '請輸入要設定的密碼'}
            className="rounded-lg border p-3"
            required
          />

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 cursor-pointer rounded-lg border py-2 hover:bg-gray-50"
              onClick={() => router.back()}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              {userData.hasPassword ? '確認修改' : '確認設定'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
