'use client';

import { MdOutlineEmail } from 'react-icons/md';
import { AuthFormProps } from '@/type/auth';
import { useState } from 'react';
import apiClient from '@/api/axios';

export default function ForgotPasswordForm({ setView }: AuthFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/forgot-password', data);
      alert(response.data.message || '重設連結已寄出！');
      setView('login');
    } catch (error: any) {
      alert(error.response?.data?.message || '發送失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="flex w-full flex-col items-center gap-9"
      action={handleSubmit}
    >
      <div className="flex w-full max-w-sm items-center bg-gray-100 px-2 py-2">
        <MdOutlineEmail size={25} className="text-gray-500" />
        <input
          name="email"
          className="w-full bg-transparent px-2 outline-none"
          type="email"
          placeholder="請輸入註冊的 Email"
          required
        />
      </div>

      <button
        className={`font-sansation rounded-full bg-orange-300 px-12 py-2 text-lg font-semibold text-white ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-orange-500'}`}
        type="submit"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Reset'}
      </button>

      <button
        type="button"
        className="cursor-pointer text-sm text-gray-400 underline hover:text-gray-500"
        onClick={() => setView('login')}
      >
        back
      </button>
    </form>
  );
}
