import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import LessonsContainerClient from './lessons-container-client';

export const dynamic = 'force-dynamic';

const breadcrumbItems = [
  {
    title: "Quản lý Unit",
    link: "/admin/units"
  }
];

async function AdminLessonPage() {
  const queryClient = new QueryClient();

  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
    <div className='flex flex-col gap-4'>
    <p className='text-2xl font-bold'>Danh sách bài học</p>
       <HydrationBoundary state={dehydrate(queryClient)}>
         <LessonsContainerClient />
       </HydrationBoundary>
    </div>
   </AdminContentLayout>
  )
}

export default AdminLessonPage