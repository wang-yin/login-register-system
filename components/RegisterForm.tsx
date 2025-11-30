import { MdOutlineAccountCircle } from 'react-icons/md'
import { MdOutlineEmail } from 'react-icons/md'
import { TbLockPassword } from 'react-icons/tb'

export default function RegisterForm() {
  return (
    <>
      <form className="flex flex-col gap-8 mt-15">
        <div className="flex items-center bg-gray-100 py-2 px-2">
          <MdOutlineAccountCircle size={25} />
          <input className="px-2" type="text" placeholder="Name"></input>
        </div>
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
        <button
          className="rounded-full py-2 px-12 bg-blue-300 mt-4 text-white font-sansation cursor-pointer text-lg font-semibold"
          type="submit"
        >
          SIGN UP
        </button>
      </form>
    </>
  )
}
