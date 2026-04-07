'use client';

import SocialButtons from './SocialButtons';
import { MdOutlineEmail } from 'react-icons/md';
import { TbLockPassword } from 'react-icons/tb';
import { AuthFormProps } from '@/type/auth';
import apiClient from '@/api/axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginForm({ setView }: AuthFormProps) {
  const [rememberedEmail, setRememberedEmail] = useState('');
  const [isRemembered, setIsRemembered] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        // 使用你寫好的 apiClient
        const response = await apiClient.get('/auth/remembered-email');
        if (response.data.email) {
          setRememberedEmail(response.data.email);
          setIsRemembered(true);
        }
      } catch (err: any) {
        console.log('No remembered email found');
      }
    };
    fetchEmail();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('remember') === 'on';

    try {
      await apiClient.post('/auth/login', Object.fromEntries(formData));
      alert('登入成功！');
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'LOGIN_FAILED';
      alert(errorMessage);
    }
  };
  return (
    <>
      <div className="my-5 flex gap-5">
        <SocialButtons />
      </div>
      <form className="flex flex-col gap-9" action={handleSubmit}>
        <div className="flex items-center bg-gray-100 px-2 py-2">
          <MdOutlineEmail size={25} />
          <input
            name="email"
            className="px-2"
            type="email"
            placeholder="Email"
            defaultValue={rememberedEmail}
            key={`email-${rememberedEmail}`}
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
        <div className="flex gap-5">
          <label className="flex cursor-pointer gap-2" htmlFor="remember">
            <input
              name="remember"
              type="checkbox"
              id="remember"
              className="cursor-pointer"
              defaultChecked={isRemembered}
              key={`check-${isRemembered}`}
            ></input>
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="cursor-pointer text-blue-500 hover:text-blue-800"
            onClick={() => setView('forgot')}
          >
            Forgot password
          </button>
        </div>
        <button
          className="font-sansation cursor-pointer rounded-full bg-green-300 px-12 py-2 text-lg font-semibold text-white hover:bg-green-400"
          type="submit"
        >
          SIGN IN
        </button>
      </form>
    </>
  );
}
