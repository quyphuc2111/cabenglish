"use client"
import { FC } from 'react';
import { Github, Linkedin, Facebook } from 'lucide-react';

const SocialIcons: FC = () => {
  return (
    <div className="flex justify-center my-4 space-x-3">
      <a href="#" className="border border-gray-300 rounded-full p-2">
        <Linkedin className="w-5 h-5" />
      </a>
      <a href="#" className="border border-gray-300 rounded-full p-2">
        <Facebook className="w-5 h-5" />
      </a>
      <a href="#" className="border border-gray-300 rounded-full p-2">
        <Github className="w-5 h-5" />
      </a>
      <a href="#" className="border border-gray-300 rounded-full p-2">
        <Linkedin className="w-5 h-5" />
      </a>
    </div>
  );
};

export default SocialIcons;
