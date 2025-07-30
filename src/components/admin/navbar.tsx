"use client";

import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { HomeIcon, ChevronRight, Bell, Settings, LogOut, User, Mail, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from 'next-auth/react';

interface NavbarProps {
  breadcrumb: {
    title: string;
    link: string;
  }[];
}

function Navbar({ breadcrumb }: NavbarProps) {
  const { data: session } = useSession();

  const user = session?.user;
  
  // Tạo avatar fallback từ email
  const getInitials = (email: string) => {
    if (!email) return 'AD';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + (name.charAt(1) || '').toUpperCase();
  };

  // Định dạng role
  const formatRole = (role: string) => {
    if (!role) return 'Admin';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  // Lấy màu badge dựa trên role
  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  return (
    <div className='bg-white border-b border-gray-200 px-6 py-4 shadow-sm'>
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
        <div className='flex items-center gap-3'>
          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                <Avatar className="h-9 w-9 ring-2 ring-gray-200">
                  <AvatarImage src="" alt="avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                    {getInitials(user?.email || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {formatRole(user?.role || 'admin')}
                    </p>
                    <Badge variant={getRoleBadgeVariant(user?.role || 'admin')} className="text-xs">
                      {formatRole(user?.role || 'admin')}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-sm">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Tài khoản của tôi</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-normal">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              
              
              <DropdownMenuItem 
                className="cursor-pointer text-destructive text-sm focus:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
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