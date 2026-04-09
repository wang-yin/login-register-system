'use client';

import apiClient from '@/api/axios';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
  const router = useRouter();
  const handleSubmit = async (formData: FormData) => {
    formData.get('currentPassword');
    formData.get('newPassword');

    try {
      const res = await apiClient.patch(
        '/auth/update-password',
        Object.fromEntries(formData),
      );
      if (res.status === 200) {
        alert('密碼修改成功，請重新登入');
        router.push('/');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || '修改失敗';
      alert(message);
    }
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          修改密碼
        </h1>
        <form className="flex flex-col gap-4" action={handleSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder="舊密碼"
            className="rounded-lg border p-3"
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="新密碼"
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
              確認修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
