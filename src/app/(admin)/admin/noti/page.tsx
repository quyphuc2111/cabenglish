import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getAllSchoolWeekAdminData } from '@/actions/schoolWeekAction';
import SectionContentContainerClient from './section-content-container-client';
import NotiContainerClient from './noti-container-client';

const breadcrumbItems = [
  {
    title: "Quản lý thông báo",
    link: ""
  },
];
async function AdminNotificationsPage() {
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
    <p className='text-2xl font-bold'>Danh sách thông báo</p>
       <HydrationBoundary state={dehydrate(queryClient)}>
         <NotiContainerClient />
       </HydrationBoundary>
    </div>
   </AdminContentLayout>
  )
}

export default AdminNotificationsPage


