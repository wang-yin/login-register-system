'use client';

import { useState } from 'react';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { MdOutlineEmail } from 'react-icons/md';
import { TbLockPassword } from 'react-icons/tb';
import apiClient from '@/api/axios';
import { AuthFormProps } from '@/type/auth';

export default function RegisterForm({ setView }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    formData.get('name');
    formData.get('email');
    formData.get('password');
    setIsLoading(true);
    try {
      const res = await apiClient.post(
        '/auth/register',
        Object.fromEntries(formData),
      );
      alert('註冊成功!');
      setView('login');
    } catch (error: any) {
      const message = error.response?.data?.message || '註冊失敗';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="mt-15 flex flex-col gap-8" action={handleSubmit}>
        <div className="flex items-center bg-gray-100 px-2 py-2">
          <MdOutlineAccountCircle size={25} />
          <input
            name="name"
            className="px-2"
            type="text"
            placeholder="Name"
            required
          ></input>
        </div>
        <div className="flex items-center bg-gray-100 px-2 py-2">
          <MdOutlineEmail size={25} />
          <input
            name="email"
            className="px-2"
            type="email"
            placeholder="Email"
            required
          ></input>
        </div>
        <div className="flex items-center bg-gray-100 px-2 py-2">
          <TbLockPassword size={25} />
          <input
            name="password"
            className="px-2"
            type="password"
            placeholder="Password"
            required
          ></input>
        </div>
        <button
          disabled={isLoading}
          className="font-sansation mt-4 cursor-pointer rounded-full bg-blue-300 px-12 py-2 text-lg font-semibold text-white hover:bg-blue-400"
          type="submit"
        >
          {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
        </button>
      </form>
    </>
  );
}
