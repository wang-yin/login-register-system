import { MdOutlineAccountCircle } from 'react-icons/md';
import { MdOutlineEmail } from 'react-icons/md';
import { TbLockPassword } from 'react-icons/tb';

export default function RegisterForm() {
  return (
    <>
      <form className="mt-15 flex flex-col gap-8">
        <div className="flex items-center bg-gray-100 px-2 py-2">
          <MdOutlineAccountCircle size={25} />
          <input
            className="px-2"
            type="text"
            placeholder="Name"
            required
          ></input>
        </div>
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
        <button
          className="font-sansation mt-4 cursor-pointer rounded-full bg-blue-300 px-12 py-2 text-lg font-semibold text-white hover:bg-blue-400"
          type="submit"
        >
          SIGN UP
        </button>
      </form>
    </>
  );
}
