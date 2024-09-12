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
import { ScrollArea } from "../ui/scroll-area";

function UserInfoModal({ children }: any) {
  const { isOpen, onClose, data } = useDialog();

  const [avatarActiveIndex, setAvatarActiveIndex] = useState(2);

  return (
    <Dialog onOpenChange={onClose} open={isOpen} modal defaultOpen={isOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[925px] !rounded-3xl">
        <Tabs
          orientation="vertical"
          defaultValue={data.data ? data.data.index?.toString() : "1"}
          className="flex flex-col lg:flex-row mt-5 lg:mt-0"
        >
          <TabsList className="grid grid-cols-2 lg:flex lg:flex-col lg:w-1/3 h-full overflow-hidden">
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
            <ScrollArea className="h-72 lg:h-full">
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
            </ScrollArea>
          </TabsContent>

          <TabsContent value="2" className="flex-1 p-4">
            <ScrollArea className="h-72 lg:h-full">
              <UserForm />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="3" className="flex-1 p-4">
            <ScrollArea className="h-72 lg:h-full">
              <StudentForm />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="4" className="flex-1 p-4">
            <ScrollArea className="h-72 lg:h-full">
              <ParentForm />
            </ScrollArea>
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
