"use client";

import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";
import { useTeachingModeStore } from "@/store/useTeachingModeStore";

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
  icon?: LucideIcon
  iconSrc: string;
  submenus: Submenu[];
  disabled?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, currentTeachingMode: string): Group[] {
  
  // console.log("first", currentTeachingMode)

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/tong-quan",
          label: "Tổng quan",
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
          href: "/tien-trinh-giang-day",
          label: "Tiến trình giảng dạy",
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
              label: "Bài giảng hoàn thành",
              active: pathname === "/tien-trinh-giang-day/bai-giang-hoan-thanh"
            },
            {
              href: "/tien-trinh-giang-day/bai-giang-dang-day",
              label: "Bài giảng đang dạy",
              active: pathname === "/tien-trinh-giang-day/bai-giang-dang-day"
            },
            {
              href: "/tien-trinh-giang-day/bai-giang-chua-day",
              label: "Bài giảng chưa dạy",
              active: pathname === "/tien-trinh-giang-day/bai-giang-chua-day"
            },
            {
              href: "/tien-trinh-giang-day/khoi-tao-lai-bai-giang",
              label: "Khởi tạo lại bài giảng",
              active: pathname === "/tien-trinh-giang-day/khoi-tao-lai-bai-giang",
              // disabled: true,
              disabled: currentTeachingMode === 'defaultMode',
            }
            // {
            //   href: "/main/khoa-hoc/tieng-anh-lop-5",
            //   label: "Tiếng anh lớp 5",
            //   active: pathname === "/main/khoa-hoc/tieng-anh-lop-5"
            // }
          ]
        },
        {
          href: "/lop-hoc",
          label: "Lớp học",
          active: pathname.includes("/lop-hoc"),
          icon: Tag,
          iconSrc: "/menu-icon/lophoc_icon.png",
          submenus: [
            {
              href: "/lop-hoc/lop-nha-tre",
              label: "Lớp nhà trẻ",
              active: pathname === "/lop-hoc/lop-nha-tre"
            },
            {
              href: "/lop-hoc/lop-3-4-tuoi",
              label: "Lớp 3 - 4 tuổi",
              active: pathname === "/lop-hoc/lop-3-4-tuoi"
            },
            {
              href: "/lop-hoc/lop-4-5-tuoi",
              label: "Lớp 4 - 5 tuổi",
              active: pathname === "/lop-hoc/lop-4-5-tuoi"
            },
            {
              href: "/lop-hoc/lop-5-6-tuoi",
              label: "Lớp 5 - 6 tuổi",
              active: pathname === "/lop-hoc/lop-5-6-tuoi"
            },
          ]
        },
        // {
        //   href: "/gift-shop",
        //   label: "Quà tặng",
        //   active: pathname.includes("/gift-shop"),
        //   icon: Tag,
        //   submenus: []
        // },
        {
          href: "/che-do-giang-day",
          label: "Cài đặt chế độ giảng dạy",
          active: pathname.includes("/che-do-giang-day"),
          icon: Tag,
          iconSrc: "/menu-icon/setting_mode.png",
          submenus: []
        },
        {
          href: "/tai-lieu-tham-khao",
          label: "Tài liệu tham khảo",
          active: pathname.includes("/tai-lieu-tham-khao"),
          icon: Tag,
          iconSrc: "/menu-icon/tailieuthamkhao.png",
          submenus: []
        },
        {
          href: "/doi-ngu-chuyen-gia",
          label: "Đội ngũ chuyên gia",
          active: pathname.includes("/doi-ngu-chuyen-gia"),
          icon: Tag,
          iconSrc: "/menu-icon/doinguchuyengia.png",
          submenus: []
        }
      ]
    },
    // {
    //   groupLabel: "",
    //   menus: [
    //     {
    //       href: "/users",
    //       label: "Users",
    //       active: pathname.includes("/users"),
    //       icon: Users,
    //       submenus: []
    //     },
    //     {
    //       href: "/account",
    //       label: "Account",
    //       active: pathname.includes("/account"),
    //       icon: Settings,
    //       submenus: []
    //     }
    //   ]
    // }
  ];
}
