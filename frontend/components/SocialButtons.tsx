import { FaGithub } from "react-icons/fa";
import { FaGooglePlusG } from 'react-icons/fa'

export default function SocialButtons() {
  return (
    <>
      <a href="http://localhost:5000/api/auth/github" className="w-10 h-10 border rounded-full items-center justify-center flex cursor-pointer">
        <FaGithub size={25} />
      </a>
      <a href="http://localhost:5000/api/auth/google" className="w-10 h-10 border rounded-full items-center justify-center flex cursor-pointer">
        <FaGooglePlusG size={25} />
      </a>
    </>
  )
}
