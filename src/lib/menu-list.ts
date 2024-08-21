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
          href: "/dashboard",
          label: "Lớp BKT",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Khóa học",
          active: pathname.includes("/posts"),
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "Tiếng anh lớp 1",
              active: pathname === "/posts"
            },
            {
              href: "/posts/new",
              label: "Tiếng anh lớp 2",
              active: pathname === "/posts/new"
            },
            {
              href: "/posts",
              label: "Tiếng anh lớp 3",
              active: pathname === "/posts"
            },
            {
              href: "/posts/new",
              label: "Tiếng anh lớp 4",
              active: pathname === "/posts/new"
            },
            {
              href: "/posts/new",
              label: "Tiếng anh lớp 5",
              active: pathname === "/posts/new"
            }
          ]
        },
        {
          href: "/tags",
          label: "Quà tặng",
          active: pathname.includes("/tags"),
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
