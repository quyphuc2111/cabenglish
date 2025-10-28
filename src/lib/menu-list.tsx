"use client";

import { getAllClassroomDataByUserId } from "@/actions/classroomAction";
import { useTranslation } from "@/hooks/useTranslation";
import { ClassroomType } from "@/types/classroom";
import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  disabled?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon;
  iconSrc: string;
  submenus: Submenu[];
  disabled?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function useMenuList(
  pathname: string,
  currentTeachingMode: string
): Group[] {
  const { t } = useTranslation("", "common");
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchClassrooms = async () => {
      if (status !== "authenticated" || !session?.user?.userId) {
        return;
      }

      const userId = session.user.userId;
      try {
        const response = await getAllClassroomDataByUserId({ userId });
        if (response.data) {
          setClassrooms(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch classrooms:", error);
      }
    };

    fetchClassrooms();
  }, [pathname, session, status]);

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/tong-quan",
          label: t("overview"),
          active: pathname.includes("/tong-quan"),
          icon: LayoutGrid,
          iconSrc: "/menu-icon/general_icon.png",
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/lop-hoc",
          label: t("classes"),
          active: pathname.includes("/lop-hoc"),
          icon: Tag,
          iconSrc: "/menu-icon/lophoc_icon.png",
          submenus: classrooms.map((classroom) => ({
            href: `/lop-hoc/${classroom.classname}`,
            label: classroom.classname,
            active:
              decodeURIComponent(pathname) === `/lop-hoc/${classroom.classname}`
          }))
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/tien-trinh-giang-day/bai-giang-hoan-thanh",
          label: t("teachingProgress"),
          active: pathname.includes("/tien-trinh-giang-day"),
          icon: SquarePen,
          iconSrc: "/menu-icon/teaching_progress.png",
          submenus: [
            // {
            //   href: "/main/khoa-hoc",
            //   label: "Khóa học mới",
            //   active: pathname === "/main/khoa-hoc"
            // },
            {
              href: "/tien-trinh-giang-day/bai-giang-hoan-thanh",
              label: t("lectureCompleted"),
              active: pathname === "/tien-trinh-giang-day/bai-giang-hoan-thanh"
            },
            {
              href: "/tien-trinh-giang-day/bai-giang-dang-day",
              label: t("lectureBeingTaught"),
              active: pathname === "/tien-trinh-giang-day/bai-giang-dang-day"
            },
            {
              href: "/tien-trinh-giang-day/bai-giang-chua-day",
              label: t("lecturePending"),
              active: pathname === "/tien-trinh-giang-day/bai-giang-chua-day"
            }

            // {
            //   href: "/main/khoa-hoc/tieng-anh-lop-5",
            //   label: "Tiếng anh lớp 5",
            //   active: pathname === "/main/khoa-hoc/tieng-anh-lop-5"
            // }
          ]
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/danh-sach-tro-choi",
          label: t("listOfGames"),
          active: pathname.includes("/danh-sach-tro-choi"),
          icon: Tag,
          iconSrc: "/menu-icon/setting_mode.png",
          submenus: []
        }
       
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/che-do-giang-day",
          label: t("setTeachingMode"),
          active: pathname.includes("/che-do-giang-day"),
          icon: Tag,
          iconSrc: "/menu-icon/setting_mode.png",
          submenus: []
        }
        // {
        //   href: "/tai-lieu-tham-khao",
        //   label: t('referenceMaterial'),
        //   active: pathname.includes("/tai-lieu-tham-khao"),
        //   icon: Tag,
        //   iconSrc: "/menu-icon/tailieuthamkhao.png",
        //   submenus: []
        // },
        // {
        //   href: "/doi-ngu-chuyen-gia",
        //   label: t('expertTeam'),
        //   active: pathname.includes("/doi-ngu-chuyen-gia"),
        //   icon: Tag,
        //   iconSrc: "/menu-icon/doinguchuyengia.png",
        //   submenus: []
        // }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/tai-lieu-tham-khao",
          label: t("referenceMaterial"),
          active: pathname.includes("/tai-lieu-tham-khao"),
          icon: Tag,
          iconSrc: "/menu-icon/tailieuthamkhao.png",
          submenus: []
        }
        // {
        //   href: "/doi-ngu-chuyen-gia",
        //   label: t('expertTeam'),
        //   active: pathname.includes("/doi-ngu-chuyen-gia"),
        //   icon: Tag,
        //   iconSrc: "/menu-icon/doinguchuyengia.png",
        //   submenus: []
        // }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/doi-ngu-chuyen-gia",
          label: t("expertTeam"),
          active: pathname.includes("/doi-ngu-chuyen-gia"),
          icon: Tag,
          iconSrc: "/menu-icon/doinguchuyengia.png",
          submenus: []
        }
      ]
    }
  ];
}

export function useAdminMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/dashboard",
          label: "Bảng điều khiển",
          active: pathname.includes("/admin/dashboard"),
          icon: LayoutGrid,
          iconSrc: "/assets/image/admin/sidebar_1.webp",
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/categories/classrooms",
          label: "Quản lý danh mục",
          active: pathname.includes("/admin/categories/classrooms"),
          icon: Tag,
          iconSrc: "/assets/image/admin/sidebar_2.webp",
          submenus: [
            {
              href: "/admin/categories/classrooms",
              label: "Quản lý lớp học",
              active: pathname === "/admin/categories/classrooms"
            },
            {
              href: "/admin/categories/school-weeks",
              label: "Quản lý tuần học",
              active: pathname === "/admin/categories/school-weeks"
            },
            {
              href: "/admin/categories/notification-types",
              label: "Quản lý loại thông báo",
              active: pathname === "/admin/categories/notification-types"
            }
          ]
        },
        {
          href: "/admin/games",
          label: "Quản lý trò chơi",
          active: pathname.includes("/admin/games"),
          icon: LayoutGrid,
          iconSrc: "/menu-icon/setting_mode.png",
          submenus: [
            {
              href: "/admin/games/topics",
              label: "Quản lý chủ đề",
              active: pathname === "/admin/games/topics"
            },
            {
              href: "/admin/games/ages",
              label: "Quản lý nhóm tuổi",
              active: pathname === "/admin/games/ages"
            },
            {
              href: "/admin/games",
              label: "Quản lý games",
              active: pathname === "/admin/games"
            },
            // {
            //   href: "/admin/games/import-export",
            //   label: "Import/Export",
            //   active: pathname === "/admin/games/import-export"
            // }
          ]
        },
        {
          href: "/admin/units",
          label: "Quản lý Unit",
          active: pathname.includes("/admin/units"),
          icon: Bookmark,
          iconSrc: "/assets/image/admin/sidebar_3.webp",
          submenus: []
        },
        {
          href: "/admin/lessons",
          label: "Quản lý bài học",
          active: pathname.includes("/admin/lessons"),
          icon: SquarePen,
          iconSrc: "/assets/image/admin/sidebar_4.webp",
          submenus: []
        },
        {
          href: "/admin/sections",
          label: "Quản lý Section",
          active: pathname.includes("/admin/sections"),
          icon: LayoutGrid,
          iconSrc: "/assets/image/admin/sidebar_5.webp",
          submenus: []
        },
        {
          href: "/admin/section-contents",
          label: "Quản lý nội dung Section",
          active: pathname.includes("/admin/section-contents"),
          icon: LayoutGrid,
          iconSrc: "/assets/image/admin/sidebar_6.webp",
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/noti",
          label: "Quản lý thông báo hệ thống",
          active: pathname.includes("/admin/noti"),
          icon: LayoutGrid,
          iconSrc: "/assets/image/admin/sidebar_7.webp",
          submenus: []
        }
      ]
    }
  ];
}
