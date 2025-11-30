import SocialButtons from '@/components/SocialButtons'
import { MdOutlineEmail } from 'react-icons/md'
import { TbLockPassword } from 'react-icons/tb'

export default function LoginForm() {
  return (
    <>
      <div className="flex gap-5 my-5">
        <SocialButtons />
      </div>
      <form className="flex flex-col gap-9">
        <div className="flex items-center bg-gray-100 py-2 px-2">
          <MdOutlineEmail size={25} />
          <input className="px-2" type="email" placeholder="Email"></input>
        </div>
        <div className="flex items-center bg-gray-100 py-2 px-2">
          <TbLockPassword size={25} />
          <input
            className="px-2"
            type="password"
            placeholder="Password"
          ></input>
        </div>
        <div className="flex gap-5 ">
          <label className="flex gap-2 cursor-pointer" htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              className="cursor-pointer"
            ></input>
            <span>Remember me</span>
          </label>
          <a
            href="https://example.com"
            className="text-blue-500 hover:text-blue-600"
          >
            Forgot password
          </a>
        </div>
        <button
          className="rounded-full py-2 px-12 bg-green-300  text-white font-sansation cursor-pointer text-lg font-semibold"
          type="submit"
        >
          SIGN IN
        </button>
      </form>
    </>
  )
}
