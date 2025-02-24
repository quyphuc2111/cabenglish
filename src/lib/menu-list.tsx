"use client";

import { useTranslation } from "@/hooks/useTranslation";
import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

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

export function useMenuList(pathname: string, currentTeachingMode: string): Group[] {
  
  // console.log("first", currentTeachingMode)

  const { t } = useTranslation('', 'common')

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/tong-quan",
          label: t('overview'),
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
          label: t('classes'),
          active: pathname.includes("/lop-hoc"),
          icon: Tag,
          iconSrc: "/menu-icon/lophoc_icon.png",
          submenus: [
            {
              href: "/lop-hoc/lop-nha-tre",
              label: t('kindergartenClass'),
              active: pathname === "/lop-hoc/lop-nha-tre"
            },
            {
              href: "/lop-hoc/lop-3-4-tuoi",
              label: t('threeToFourYearOld'),
              active: pathname === "/lop-hoc/lop-3-4-tuoi"
            },
            {
              href: "/lop-hoc/lop-4-5-tuoi",
              label: t('fourToFiveYearOld'),
              active: pathname === "/lop-hoc/lop-4-5-tuoi"
            },
            {
              href: "/lop-hoc/lop-5-6-tuoi",
              label: t('fiveToSixYearOld'),
              active: pathname === "/lop-hoc/lop-5-6-tuoi"
            },
          ]
        },
        {
          href: "/tien-trinh-giang-day",
          label: t('teachingProgress'),
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
              label: t('lectureCompleted'),
              active: pathname === "/tien-trinh-giang-day/bai-giang-hoan-thanh"
            },
            {
              href: "/tien-trinh-giang-day/bai-giang-dang-day",
              label: t('lectureBeingTaught'),
              active: pathname === "/tien-trinh-giang-day/bai-giang-dang-day"
            },
            {
              href: "/tien-trinh-giang-day/bai-giang-chua-day",
              label: t('lecturePending'),
              active: pathname === "/tien-trinh-giang-day/bai-giang-chua-day"
            },
            {
              href: "/tien-trinh-giang-day/khoi-tao-lai-bai-giang",
              label: t('recreateTheLecture'),
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
      
        // {
        //   href: "/gift-shop",
        //   label: "Quà tặng",
        //   active: pathname.includes("/gift-shop"),
        //   icon: Tag,
        //   submenus: []
        // },
        {
          href: "/che-do-giang-day",
          label: t('setTeachingMode'),
          active: pathname.includes("/che-do-giang-day"),
          icon: Tag,
          iconSrc: "/menu-icon/setting_mode.png",
          submenus: []
        },
        {
          href: "/tai-lieu-tham-khao",
          label: t('referenceMaterial'),
          active: pathname.includes("/tai-lieu-tham-khao"),
          icon: Tag,
          iconSrc: "/menu-icon/tailieuthamkhao.png",
          submenus: []
        },
        {
          href: "/doi-ngu-chuyen-gia",
          label: t('expertTeam'),
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
