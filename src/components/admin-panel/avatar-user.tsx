"use client";
import React from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

function AvatarUser({ avatarUrl, email, sidebar }: any) {
  const router = useRouter();

  const handleAvatarClick = () => {
    //  router.push('/bao-cao-hoc-tap')
  };

  return (
    <div
      className="flex flex-col items-center gap-3 text-white cursor-pointer mt-6"
      onClick={handleAvatarClick}
    >
      <div className="relative avatar-container">
        <div className="bg-white rounded-full p-1">
          <Image
            src={"https://static.edupia.vn/images/avata_system/55.png"}
            alt="avatar-user"
            width={80}
            height={80}
          />
        </div>
        {sidebar?.isOpen && email && (
          <Badge 
            title={email || "Bê Ka Tê"} 
            className="bg-[#1ACAEF] hover:bg-[#1ACAEF] rounded-full bottom-0 text-center flex items-center justify-center absolute left-1/2 -translate-x-1/2 max-w-[200px] min-w-0 transition-[opacity,transform] duration-200 ease-in-out animate-in fade-in slide-in-from-bottom-2"
          >
            <span className="truncate block w-full px-2">
              {email || "Bê Ka Tê"}
            </span>
          </Badge>
        )}
      </div>
    </div>
  );
}

export default AvatarUser;
