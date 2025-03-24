import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getAllSchoolWeekAdminData } from '@/actions/schoolWeekAction';
import SectionsContainerClient from './sections-container-client';

const breadcrumbItems = [
  {
    title: "Quản lý sections",
    link: ""
  },
];
async function AdminSectionsPage() {
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
    <p className='text-2xl font-bold'>Danh sách Sections</p>
       <HydrationBoundary state={dehydrate(queryClient)}>
         <SectionsContainerClient />
       </HydrationBoundary>
    </div>
   </AdminContentLayout>
  )
}

export default AdminSectionsPage