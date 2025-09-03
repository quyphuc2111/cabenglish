"use client"

import React from 'react'

import AdminDashboardCardInfo from '@/components/card/admin-card'
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Loading } from '@/components/common/loading';

// Định nghĩa cấu trúc dữ liệu cho dashboard cards
const DASHBOARD_CARDS = [
  {
    title: "Số lượng user",
    key: "totalUser",
    imageUrl: "/assets/image/admin/user_icon.webp"
  },
  {
    title: "Số lượng bài học",
    key: "totalLesson",
    imageUrl: "/assets/image/admin/lesson_icon.webp"
  },
  {
    title: "Số lượng yêu thích lớp học",
    key: "totalClassroomLiked",
    imageUrl: "/assets/image/admin/user_icon.webp"
  },
  {
    title: "Số lượng yêu thích bài học",
    key: "totalLessonLiked",
    imageUrl: "/assets/image/admin/user_icon.webp"
  },
  {
    title: "Số lượng thông báo",
    key: "totalNotification",
    imageUrl: "/assets/image/admin/user_icon.webp"
  }
] as const;

function DashboardClient() {
  const { data: adminDashboardData, isLoading } = useAdminDashboard();

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[400px]">
        {DASHBOARD_CARDS.map(({ title, key, imageUrl }) => (
          <AdminDashboardCardInfo
            key={key}
            title={title}
            value={adminDashboardData?.data[key]}
            imageUrl={imageUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default DashboardClient