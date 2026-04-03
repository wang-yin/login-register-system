import SocialButtons from './SocialButtons';
import { MdOutlineEmail } from 'react-icons/md';
import { TbLockPassword } from 'react-icons/tb';
import { AuthFormProps } from '@/type/auth';

export default function LoginForm({ setView }: AuthFormProps) {
  return (
    <>
      <div className="my-5 flex gap-5">
        <SocialButtons />
      </div>
      <form className="flex flex-col gap-9">
        <div className="flex items-center bg-gray-100 px-2 py-2">
          <MdOutlineEmail size={25} />
          <input
            className="px-2"
            type="email"
            placeholder="Email"
            required
          ></input>
        </div>
        <div className="flex items-center bg-gray-100 px-2 py-2">
          <TbLockPassword size={25} />
          <input
            className="px-2"
            type="password"
            placeholder="Password"
            required
          ></input>
        </div>
        <div className="flex gap-5">
          <label className="flex cursor-pointer gap-2" htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              className="cursor-pointer"
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
