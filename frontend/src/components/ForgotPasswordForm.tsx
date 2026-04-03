import { MdOutlineEmail } from 'react-icons/md';
import { AuthFormProps } from '@/type/auth';

export default function ForgotPasswordForm({ setView }: AuthFormProps) {
  return (
    <form className="flex w-full flex-col items-center gap-9">
      <div className="flex w-full max-w-sm items-center bg-gray-100 px-2 py-2">
        <MdOutlineEmail size={25} className="text-gray-500" />
        <input
          className="w-full bg-transparent px-2 outline-none"
          type="email"
          placeholder="請輸入註冊的 Email"
          required
        />
      </div>

      <button
        className={`font-sansation rounded-full bg-orange-300 px-12 py-2 text-lg font-semibold text-white`}
        type="submit"
      >
        Reset
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
