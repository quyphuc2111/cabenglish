import {
  Tag,
  Settings,
  LayoutGrid,
  LucideIcon,
  BookOpen,
  Gift,
  Maximize2
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
          href: "/chon-lop-hoc",
          label: "Lớp học",
          active: pathname.includes("/chon-lop-hoc"),
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
          label: "Khoá học",
          active: pathname.includes("/main/khoa-hoc") || pathname.includes("/khoa-hoc"),
          icon: BookOpen,
          submenus: [
            {
              href: "/main/khoa-hoc/tieng-anh-lop-1",
              label: "CAB Kid 1",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-1"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-2",
              label: "CAB Kid 2",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-2"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-3",
              label: "CAB Kid 3",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-3"
            },
            {
              href: "/main/khoa-hoc/tieng-anh-lop-4",
              label: "CAB Kid 4",
              active: pathname === "/main/khoa-hoc/tieng-anh-lop-4"
            }
          ]
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Mở rộng",
          active: pathname.includes("/mo-rong"),
          icon: Maximize2,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Quà tặng",
          active: pathname.includes("/gift-shop"),
          icon: Gift,
          submenus: []
        }
      ]
    }
  ];
}
