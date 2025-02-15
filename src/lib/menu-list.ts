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
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon
  iconSrc: string;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/lop-hoc",
          label: "Tổng quan",
          active: pathname.includes("/lop-hoc"),
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
          href: "/main/khoa-hoc",
          label: "Tiến trình giảng dạy",
          active: pathname.includes("/main/khoa-hoc"),
          icon: SquarePen,
          iconSrc: "/menu-icon/teaching_progress.png",
          submenus: [
            // {
            //   href: "/main/khoa-hoc",
            //   label: "Khóa học mới",
            //   active: pathname === "/main/khoa-hoc"
            // },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-1",
              label: "Bài giảng hoàn thành",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-1"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-2",
              label: "Bài giảng đang dạy",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-2"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-3",
              label: "Bài giảng chưa dạy",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-3"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-4",
              label: "Khởi tạo lại bài giảng",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-4"
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
          href: "/gift-shop",
          label: "Cài đặt chế độ giảng dạy",
          active: pathname.includes("/gift-shop"),
          icon: Tag,
          iconSrc: "/menu-icon/setting_mode.png",
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
