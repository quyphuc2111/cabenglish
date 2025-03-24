"use client";

import { Navbar } from "@/components/admin-panel/navbar";
import { ScrollArea } from "../ui/scroll-area";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  type?: string;
}

const userData = {
  user_id: "1",
  email: "test@gmail.com",
  language: "vi",
  theme: "theme-red",
  mode: "defaultMode",
  progress: {
    units: [
      {
        unit_id: 1
      },
      {
        unit_id: 2
      }
    ],
    lessons: [
      {
        lesson_id: 1
      },
      {
        lesson_id: 2
      }
    ],
    sections: [
      {
        section_id: 1
      },
      {
        section_id: 2
      }
    ],
    classrooms: [
      {
        class_id: 1
      },
      {
        class_id: 2
      }
    ]
  },
  locked: {
    sections: [1, 2],
    section_contents: [1, 2],
    lessons: [1, 2]
  }
};

export function ContentLayout({ title, type, children }: ContentLayoutProps) {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      setUser({
        ...userData
      });
    }
  }, []);

  return (
    <>
      <div className="2xl:px-8 mt-5 ">
        <Navbar title={title} type={type} />
      </div>
      <ScrollArea className="h-5/6 2xl:px-[40px] mt-7 ">
        <div className="lg:pt-2 lg:pb-12">{children}</div>
      </ScrollArea>
    </>
  );
}
