import React from 'react'
import AdminDashboardCardInfo from '@/components/card/admin-card'

function DashboardClient() {
  return (
    <div className="flex flex-col gap-4">
    <div className="bg-white rounded-lg p-4 grid grid-cols-4 gap-4 min-h-[400px]">
      <AdminDashboardCardInfo title="Số lượng user" value={40689} imageUrl="/assets/image/admin/user_icon.webp" />
      <AdminDashboardCardInfo title="Số lượng bài học" value={10290} imageUrl="/assets/image/admin/lesson_icon.webp" />
      <AdminDashboardCardInfo title="Số lượng yêu thích lớp học" value={930} imageUrl="/assets/image/admin/user_icon.webp" />
      <AdminDashboardCardInfo title="Số lượng yêu thích bài học" value={1209} imageUrl="/assets/image/admin/user_icon.webp" />
      <AdminDashboardCardInfo title="Số lượng thông báo" value={1000} imageUrl="/assets/image/admin/user_icon.webp" />
    </div>
  </div>
  )
}

export default DashboardClient