import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import UserInfoModal from "./modal/user-info-modal";
import { useDialog } from "@/hooks/useDialog";

function SectionTitle({ title, index }: any) {
  const {isOpen, onClose, onOpen, setData} = useDialog()

  const handleChangeModal = () => {
    isOpen ? onClose() : onOpen()
    setData({index: index})

  }

  return (
    <div className="border-l-4 border-l-[#ff9213] flex justify-between pl-2 items-center">
      <h2 className="text-xl font-semibold">{title}</h2>

      
      <Button className="flex gap-1 bg-transparent border-none shadow-none text-cyan hover:text-white" onClick={handleChangeModal}>
        <Image
          src="https://static.edupia.vn/uploads/v3/assets/images/icons/pencil-line.svg"
          width={16}
          height={16}
          alt="pencil"
        />
        <span className="text-md ">Chỉnh sửa</span>
      </Button>
      
    </div>
  );
}

export default SectionTitle;
