import React from 'react';
import { AdminContentLayout } from '@/components/admin-panel/admin-content-layout';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import TopicsContainerClient from './topics-container-client';

export const dynamic = 'force-dynamic';

const breadcrumbItems = [
  {
    title: "Quản lý trò chơi",
    link: "/admin/games"
  },
  {
    title: "Quản lý chủ đề",
    link: "/admin/games/topics"
  }
];

async function GameTopicsPage() {
  const queryClient = new QueryClient();

  return (
    <AdminContentLayout breadcrumb={breadcrumbItems}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TopicsContainerClient />
      </HydrationBoundary>
    </AdminContentLayout>
  );
}

export default GameTopicsPage;

