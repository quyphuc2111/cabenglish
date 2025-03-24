"use client";

import { useCallback, memo } from "react";
// import { type SectionType } from "./columns";
import { useModal } from "@/hooks/useModalStore";
import OptimizeImage from "@/components/common/optimize-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useNotiStore } from "@/store/useNoti";
import { NotiAdminType } from "@/types/notification";

interface ActionCellProps {
  row: {
    original: NotiAdminType;
  };
}

export const ActionCell = memo(function ActionCell({ row }: ActionCellProps) {
  const { onOpen } = useModal();
  const noti = row.original;
  // const { activeLesson } = useLessonStore();
  const {selectedNotiType} = useNotiStore();

  const handleEdit = useCallback(() => {
    onOpen("createUpdateNoti", {
      formType: "update",
      noti: noti,
      notiType: selectedNotiType,
      notiId: noti.ntId
    });
  }, [noti, selectedNotiType, onOpen]);

  const handleDelete = useCallback(() => {
    onOpen("deleteNoti", {
      notiIds: [noti.ntId.toString()],
      noti: noti
    //   schoolWeek: {
    //     swId: schoolWeek.swId,
    //     value: schoolWeek.value
    //   } as any
    });
  }, [noti, onOpen]);

  const handleSendNoti = useCallback(() => {
    onOpen("sendNoti", {
      noti: noti
    });
  }, [noti, onOpen]); 

  return (
    <div className="flex gap-2">
      <TooltipProvider>
      <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer" onClick={handleSendNoti}>
              <OptimizeImage
                src="/assets/image/admin/send_noti.webp"
                width={25}
                height={25}
                alt="send noti"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[500px] whitespace-pre-wrap">
            Gửi thông báo
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer" onClick={handleEdit}>
              <OptimizeImage
                src="/assets/image/admin/edit_icon.webp"
                width={25}
                height={25}
                alt="edit"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[500px] whitespace-pre-wrap">
            Sửa
          </TooltipContent>
        </Tooltip>
     
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer" onClick={handleDelete}>
              <OptimizeImage
                src="/assets/image/admin/delete_icon.webp"
                width={25}
                height={25}
                alt="delete"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[500px] whitespace-pre-wrap">
            Xóa
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
