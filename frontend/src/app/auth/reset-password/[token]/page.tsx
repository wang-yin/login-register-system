'use client';

import apiClient from '@/api/axios';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const token = params.token;

    if (data.password !== data.confirmPassword) return alert('密碼不一致');
    if (!token) {
      return alert('無效的憑證，請重新從郵件連結進入');
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/reset-password', {
        token: token,
        password: data.password,
      });
      alert('密碼重設成功！即將跳轉至登入頁面');
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.message || '操作失敗');
    }
  };
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
        action={handleSubmit}
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-orange-400">
          設定新密碼
        </h2>
        <input
          name="password"
          type="password"
          placeholder="新密碼"
          className="mb-4 w-full rounded border p-2"
          required
        ></input>
        <input
          name="confirmPassword"
          type="password"
          placeholder="確認新密碼"
          className="mb-4 w-full rounded border p-2"
          required
        ></input>
        <button
          disabled={loading}
          type="submit"
          className="w-full cursor-pointer rounded-full bg-orange-400 py-2 font-bold text-white transition hover:bg-orange-300"
        >
          {loading ? '儲存中...' : '儲存新密碼'}
        </button>
      </form>
    </div>
  );
}
