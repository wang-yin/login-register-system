import { FaGithub } from 'react-icons/fa';
import { FaGooglePlusG } from 'react-icons/fa';

export default function SocialButtons() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return (
    <>
      <a
        href={`${API_BASE_URL}/auth/github`}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border"
      >
        <FaGithub size={25} />
      </a>
      <a
        href={`${API_BASE_URL}/auth/google`}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border"
      >
        <FaGooglePlusG size={25} />
      </a>
    </>
  );
}
