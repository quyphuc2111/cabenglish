import React from 'react';
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import AgesContainerClient from './ages-container-client';

export const dynamic = 'force-dynamic';

const breadcrumbItems = [
  {
    title: "Quản lý trò chơi",
    link: "/admin/games"
  },
  {
    title: "Quản lý nhóm tuổi",
    link: "/admin/games/ages"
  }
];

async function GameAgesPage() {
  const queryClient = new QueryClient();

  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AgesContainerClient />
      </HydrationBoundary>
    </AdminContentLayout>
  );
}

export default GameAgesPage;

