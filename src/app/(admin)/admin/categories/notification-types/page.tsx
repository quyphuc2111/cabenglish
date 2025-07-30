import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import NotificationTypesContainerClient from './notification-types-container-client'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAllNotiTypeAdminData } from '@/actions/notificationAction';

export const dynamic = 'force-dynamic';

const breadcrumbItems = [
  {
    title: "Quản lý danh mục",
    link: ""
  },
  {
    title: "Quản lý loại thông báo",
    link: "/admin/categories/notification-types"
  }
];

async function AdminNotificationTypesPage() {
  const adminNotificationTypeData = await getAllNotiTypeAdminData();
  
  const queryClient = new QueryClient();

  // Prefetch trên server
  await queryClient.prefetchQuery({
    queryKey: ["notitypes"],
    queryFn: () => adminNotificationTypeData
  });
  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
    <div className='flex flex-col gap-4'>
    <p className='text-2xl font-bold'>Danh sách loại thông báo</p>
       <HydrationBoundary state={dehydrate(queryClient)}>
         <NotificationTypesContainerClient />
       </HydrationBoundary>
    </div>
   </AdminContentLayout>
  )
}

export default AdminNotificationTypesPage