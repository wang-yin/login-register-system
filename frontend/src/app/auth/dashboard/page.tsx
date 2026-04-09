'use client';

import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { MdAccountCircle } from 'react-icons/md';

export default function AuthSuccess() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-200">
      <div className="flex h-4/12 w-3xl items-center justify-center rounded-2xl bg-white shadow-lg">
        <div>
          <p className="text-4xl">歡迎xxx</p>
          <div className="group mt-20 flex cursor-pointer items-center justify-center rounded-2xl border-2 bg-white py-2 hover:bg-gray-100">
            <MdAccountCircle size={25} className="mr-2" />
            <button
              className="group-hover:cursor-pointer"
              onClick={() => {
                router.push('/auth/change-password');
              }}
            >
              修改密碼
            </button>
          </div>
          <div className="group mt-10 flex cursor-pointer items-center justify-center rounded-2xl border-2 bg-white py-2 hover:bg-gray-100">
            <FiLogOut size={25} className="mr-2" />
            <button className="group-hover:cursor-pointer">登出</button>
          </div>
        </div>
      </div>
    </div>
  );
}
