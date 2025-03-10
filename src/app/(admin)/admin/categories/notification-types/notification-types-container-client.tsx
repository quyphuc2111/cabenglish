"use client";
import SearchInput from "@/components/admin/search-input";
import { Button } from "@/components/ui/button";
import React from "react";

function NotificationTypesContainerClient() {
  const notificationTypeData = Array.from({length: 20}, (_, i) => ({
    value: `notification-type-${i}`,
    label: `Loại thông báo ${i}`
  }))

  return (
    <div className="bg-white rounded-lg p-10">
        <div className="flex justify-between items-center">
        <SearchInput data={notificationTypeData} placeholder="Tìm kiếm loại thông báo" />
        <div className="flex gap-5">
            <Button variant="outline">Xuất dữ liệu</Button>
            <Button variant="outline">Nhập dữ liệu</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Tạo tuần học mới</Button>
        </div>
        </div>
    </div>
  );
}

export default NotificationTypesContainerClient;
