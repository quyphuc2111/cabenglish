import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import SchoolWeeksContainerClient from './school-weeks-container-client'
function AdminSchoolWeeksPage() {
  return (
    <AdminContentLayout title="Quản lý tuần học">
     <div className='flex flex-col gap-4'>
     <p className='text-2xl font-bold'>Danh sách tuần học</p>
        <SchoolWeeksContainerClient />
     </div>
    </AdminContentLayout>
  )
}

export default AdminSchoolWeeksPage