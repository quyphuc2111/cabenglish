import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import NotificationTypesContainerClient from './notification-types-container-client'
function AdminNotificationTypesPage() {
  return (
    <AdminContentLayout title="Quản lý loại thông báo">
     <div className='flex flex-col gap-4'>
     <p className='text-2xl font-bold'>Danh sách loại thông báo</p>
        <NotificationTypesContainerClient />
     </div>
    </AdminContentLayout>
  )
}

export default AdminNotificationTypesPage