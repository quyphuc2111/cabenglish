import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import SchoolWeeksContainerClient from './school-weeks-container-client'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getAllSchoolWeekAdminData } from '@/actions/schoolWeekAction';

const breadcrumbItems = [
  {
    title: "Quản lý danh mục",
    link: "/admin/categories"
  },
  {
    title: "Quản lý tuần học",
    link: "/admin/categories/school-weeks"
  }
];
async function AdminSchoolWeeksPage() {
  const adminSchoolWeekData = await getAllSchoolWeekAdminData();
  
  const queryClient = new QueryClient();

  // Prefetch trên server
  await queryClient.prefetchQuery({
    queryKey: ["school-weeks"],
    queryFn: () => adminSchoolWeekData
  });

  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
    <div className='flex flex-col gap-4'>
    <p className='text-2xl font-bold'>Danh sách tuần học</p>
       <HydrationBoundary state={dehydrate(queryClient)}>
         <SchoolWeeksContainerClient />
       </HydrationBoundary>
    </div>
   </AdminContentLayout>
  )
}

export default AdminSchoolWeeksPage