import { FaGithub } from 'react-icons/fa';
import { FaGooglePlusG } from 'react-icons/fa';

export default function SocialButtons() {
  return (
    <>
      <a
        href="xxx" // 要改
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border"
      >
        <FaGithub size={25} />
      </a>
      <a
        href="http://localhost:5000/api/auth/google" 
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border"
      >
        <FaGooglePlusG size={25} />
      </a>
    </>
  );
}
