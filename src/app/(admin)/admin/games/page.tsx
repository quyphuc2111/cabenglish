import React from 'react';
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import GamesContainerClient from './games-container-client';

export const dynamic = 'force-dynamic';

const breadcrumbItems = [
  {
    title: "Quản lý trò chơi",
    link: "/admin/games"
  }
];

async function AdminGamesPage() {
  const queryClient = new QueryClient();

  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GamesContainerClient />
      </HydrationBoundary>
    </AdminContentLayout>
  );
}

export default AdminGamesPage;
