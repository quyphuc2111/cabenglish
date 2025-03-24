import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAllNotiTypeAdminData } from '@/actions/notificationAction';
import UnitsContainerClient from './units-container-client';

const breadcrumbItems = [
  {
    title: "Quản lý Unit",
    link: "/admin/units"
  }
];

async function AdminUnitsPage() {
//   const adminUnitsData = await getAllNotiTypeAdminData();
  
  const queryClient = new QueryClient();

  // Prefetch trên server
//   await queryClient.prefetchQuery({
//     queryKey: ["units"],
//     queryFn: () => adminUnitsData
//   });

  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
    <div className='flex flex-col gap-4'>
    <p className='text-2xl font-bold'>Danh sách Unit</p>
       <HydrationBoundary state={dehydrate(queryClient)}>
         <UnitsContainerClient />
       </HydrationBoundary>
    </div>
   </AdminContentLayout>
  )
}

export default AdminUnitsPage