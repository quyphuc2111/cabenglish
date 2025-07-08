import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getAllSchoolWeekAdminData } from '@/actions/schoolWeekAction';
import SectionContentContainerClient from './section-content-container-client';

export const dynamic = 'force-dynamic';

const breadcrumbItems = [
  {
    title: "Quản lý section contents",
    link: ""
  },
];
async function AdminSectionContentPage() {
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
    <p className='text-2xl font-bold'>Danh sách nội dung section</p>
       <HydrationBoundary state={dehydrate(queryClient)}>
         <SectionContentContainerClient />
       </HydrationBoundary>
    </div>
   </AdminContentLayout>
  )
}

export default AdminSectionContentPage