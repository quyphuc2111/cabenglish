"use client"
import { FC } from 'react';
import SocialIcons from './SocialIcons';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  type: 'Sign Up' | 'Sign In';
  animated: boolean;
}

const AuthForm: FC<AuthFormProps> = ({ type, animated }) => {
  const router = useRouter()
  return (
    <div className={`absolute top-0 h-full w-1/2 flex items-center justify-center flex-col p-10 transition-all duration-700 ease-in-out ${type == 'Sign In' ? "" : "right-0"}`}>
      <h1 className="text-3xl font-bold">{type}</h1>
      <SocialIcons />
      <span className="text-sm mt-4 mb-2">
        or use your email for {type === 'Sign Up' ? 'registration' : 'login'}
      </span>
      <input
        type="text"
        placeholder="Name"
        className={`bg-gray-100 p-3 rounded w-full mt-2 ${type === 'Sign Up' ? '' : 'hidden'}`}
      />
      <input type="email" placeholder="Email" className="bg-gray-100 p-3 rounded w-full mt-2" />
      <input type="password" placeholder="Password" className="bg-gray-100 p-3 rounded w-full mt-2" />
      <button className="bg-purple-700 text-white mt-4 p-2 px-6 rounded uppercase tracking-wide" onClick={() => router.push('/lop-hoc')}>
        {type}
      </button>
    </div>
  );
};

export default AuthForm;
