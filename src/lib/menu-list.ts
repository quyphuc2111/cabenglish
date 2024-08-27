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
  icon: LucideIcon
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
          label: "Lớp BKT",
          active: pathname.includes("/lop-hoc"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/main/khoa-hoc",
          label: "Khóa học",
          active: pathname.includes("/main/khoa-hoc"),
          icon: SquarePen,
          submenus: [
            // {
            //   href: "/main/khoa-hoc",
            //   label: "Khóa học mới",
            //   active: pathname === "/main/khoa-hoc"
            // },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-1",
              label: "Tiếng anh lớp 1",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-1"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-2",
              label: "Tiếng anh lớp 2",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-2"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-3",
              label: "Tiếng anh lớp 3",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-3"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-4",
              label: "Tiếng anh lớp 4",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-4"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-5",
              label: "Tiếng anh lớp 5",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-5"
            }
          ]
        },
        {
          href: "/gift-shop",
          label: "Quà tặng",
          active: pathname.includes("/gift-shop"),
          icon: Tag,
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
