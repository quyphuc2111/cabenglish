import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import ClassroomContainerClient from './classroom-container-client'
function AdminClassroomPage() {
  return (
    <AdminContentLayout title="Quản lý lớp học">
     <div className='flex flex-col gap-4'>
     <p className='text-2xl font-bold'>Danh sách lớp học</p>
        <ClassroomContainerClient />
     </div>
    </AdminContentLayout>
  )
}

export default AdminClassroomPage