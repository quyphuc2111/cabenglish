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
        {sidebar?.isOpen && (
          <Badge className="bg-[#1ACAEF] rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center flex items-center justify-center">
            {email || "Bê Ka Tê"}
          </Badge>
        )}
      </div>
    </div>
  );
}

export default AvatarUser;
