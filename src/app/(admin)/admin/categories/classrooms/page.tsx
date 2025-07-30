import React from 'react'
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import ClassroomContainerClient from './classroom-container-client'
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllClassroomAdminData } from '@/actions/classroomAction';
import * as Sentry from "@sentry/nextjs";

export const dynamic = 'force-dynamic';

const breadcrumbItems = [
  {
    title: "Quản lý danh mục",
    link: ""
  },
  {
    title: "Quản lý lớp học", 
    link: "/admin/categories/classrooms"
  }
];
async function AdminClassroomPage() {
  try {
    const adminData = await getAllClassroomAdminData();
    
    const queryClient = new QueryClient();

    // Prefetch trên server
    await queryClient.prefetchQuery({
      queryKey: ["classrooms"],
      queryFn: () => adminData
    });

    return (
      <AdminContentLayout breadcrumb={breadcrumbItems}>
        <div className='flex flex-col gap-4'>
          <p className='text-2xl font-bold'>Danh sách lớp học</p>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ClassroomContainerClient />
          </HydrationBoundary>
        </div>
      </AdminContentLayout>
    )
  } catch (error) {
    Sentry.captureException(error);
    throw error; 
  }
}

export default AdminClassroomPage