import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AVATAR_SYSTEM } from "@/mock/data";
import Image from "next/image";
import { UserForm } from "../form/user/user-form";
import { StudentForm } from "../form/student/student-form";
import { useDialog } from "@/hooks/useDialog";
import { ParentForm } from "../form/parent/parent-form";

function UserInfoModal({ children }: any) {
  const {isOpen, onClose} = useDialog()
  const [avatarActiveIndex, setAvatarActiveIndex] = useState(2);


  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[925px] !rounded-3xl">
     
        <DialogHeader>
          <DialogTitle>
            {/* <h2 className="text-2xl border-l-[#ff9213] border-l-4 px-2 py-1">Lịch sử dùng xu</h2> */}
          </DialogTitle>
        </DialogHeader>
        <Tabs orientation="vertical" defaultValue="1" className="flex">
          <TabsList className="flex flex-col w-1/6 lg:w-1/3 h-full overflow-hidden">
            <TabsTrigger
              className="h-16 w-full font-semibold text-base md:text-lg break-words whitespace-pre-wrap overflow-hidden"
              value="1"
            >
              Avatar
            </TabsTrigger>
            <TabsTrigger
              className="h-16 w-full font-semibold text-base md:text-lg break-words whitespace-pre-wrap overflow-hidden"
              value="2"
            >
              Thông tin tài khoản
            </TabsTrigger>
            <TabsTrigger
              className="h-16 w-full font-semibold text-base md:text-lg break-words whitespace-pre-wrap overflow-hidden"
              value="3"
            >
              Thông tin học sinh
            </TabsTrigger>
            <TabsTrigger
              className="h-16 w-full font-semibold text-base md:text-lg break-words whitespace-pre-wrap overflow-hidden"
              value="4"
            >
              Thông tin phụ huynh
            </TabsTrigger>
          </TabsList>
          <TabsContent value="1" className="flex-1 p-4">
            <div className="flex flex-col gap-8 items-center">
              <h2 className="text-2xl font-semibold text-zinc-700">
                Thay đổi avatar
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {AVATAR_SYSTEM.map((item, index) => {
                  return (
                    <div
                      onClick={() => setAvatarActiveIndex(index)}
                      key={index}
                      className={`rounded-full relative ${
                        index == avatarActiveIndex
                          ? "border-2 border-green-500"
                          : "border-2 border-white"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={104}
                        height={104}
                      />

                      {index == avatarActiveIndex && (
                        <div className="absolute right-0 bottom-0">
                          <Image
                            src="https://static.edupia.vn/uploads/v3/assets/images/icons/btn-active-avt.png"
                            alt="check"
                            width={25}
                            height={25}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button className="bg-[#21bdc6] w-[200px] py-6 font-semibold text-xl">
                Lưu
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="2" className="flex-1 p-4">
            <UserForm />
          </TabsContent>

          <TabsContent value="3" className="flex-1 p-4">
            <StudentForm />
          </TabsContent>

          <TabsContent value="4" className="flex-1 p-4">
            <ParentForm />
          </TabsContent>
        </Tabs>

        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default UserInfoModal;
