import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { HomeIcon, ChevronRight, Bell, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavbarProps {
  breadcrumb: {
    title: string;
    link: string;
  }[];
}

function Navbar({ breadcrumb }: NavbarProps) {
  return (
    <div className='bg-white p-4 shadow-sm rounded-lg'>
      <div className='flex items-center justify-between'>
        {/* Breadcrumb section */}
        <div className='flex-1'>
          <Breadcrumb>
            <BreadcrumbList className="text-base">
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <HomeIcon className="h-5 w-5" />
                  <span>Trang chủ</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              {breadcrumb.map((item, index) => (
                <React.Fragment key={item.link || index}>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-5 w-5" />
                  </BreadcrumbSeparator>
                  
                  <BreadcrumbItem>
                    {item.link ? (
                      <BreadcrumbLink 
                        href={item.link}
                        className="text-muted-foreground hover:text-primary transition-colors text-base"
                      >
                        {item.title}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="font-medium text-primary text-base">
                        {item.title}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Account section */}
        <div className='flex items-center gap-4'>
          {/* Notifications */}
          {/* <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-base font-medium">Admin Name</p>
                  <p className="text-sm text-muted-foreground">admin@example.com</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-base">Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-base">
                <Settings className="mr-2 h-5 w-5" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive text-base">
                <LogOut className="mr-2 h-5 w-5" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Navbar