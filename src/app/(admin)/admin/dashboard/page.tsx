import React from "react";
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout'
import DashboardClient from "./dashboard-client";

const breadcrumbItems = [
  {
    title: "Bảng điều khiển",
    link: "/admin/dashboard"
  }
];
function AdminDashboardPage() {
  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
       <p className='text-2xl font-bold mb-4'>Bảng điều khiển</p>
      <DashboardClient />
    </AdminContentLayout>
  );
}

export default AdminDashboardPage;
