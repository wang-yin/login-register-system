import { FaFacebookF } from 'react-icons/fa'
import { FaGooglePlusG } from 'react-icons/fa'

export default function SocialButtons() {
  return (
    <>
      <button className="w-10 h-10 border rounded-full items-center justify-center flex cursor-pointer">
        <FaFacebookF size={25} />
      </button>
      <button className="w-10 h-10 border rounded-full items-center justify-center flex cursor-pointer">
        <FaGooglePlusG size={25} />
      </button>
    </>
  )
}
