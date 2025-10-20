import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from "next/image";
import { AdminMenu } from "./admin-menu";
import { AdminSidebarToggle } from "./admin-sidebar-toggle";

export function AdminSidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-screen transition-[width] ease-in-out duration-200 bg-[#c35690] text-white bg-menu-texture will-change-[width]",
          // Ẩn hoàn toàn trên mobile/tablet, chỉ hiển thị trên desktop
          "hidden lg:block",
          // Desktop widths
          sidebar?.isOpen === false ? "lg:w-[100px]" : "lg:w-72"
        )}
      >
        <div className="relative h-full flex flex-col z-[1]">
          {/* Header với logo */}
          <div className="flex justify-between px-4 py-3 flex-shrink-0">
            <Image
              src="/bkt_logo.png"
              width={sidebar?.isOpen === false ? 50 : 70}
              height={sidebar?.isOpen === false ? 35 : 50}
              alt="bkt-logo"
              priority
              quality={75}
              loading="eager"
              className="transition-[width,height] duration-200 ease-in-out"
            />
          </div>

          {/* Menu - sử dụng flex-1 để chiếm không gian còn lại, trừ đi không gian cho toggle */}
          <div className="flex-1 overflow-hidden min-h-0">
            <AdminMenu isOpen={sidebar?.isOpen} />
          </div>

          {/* Toggle button ở dưới cùng - cố định không gian */}
          <div className="flex-shrink-0 p-4 border-t border-white/10">
            <AdminSidebarToggle
              isOpen={sidebar?.isOpen}
              setIsOpen={sidebar?.setIsOpen}
            />
          </div>
        </div>
      </aside>
  );
}
