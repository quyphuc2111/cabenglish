"use client"
import React, { useEffect, useState } from 'react'

import CreateUpdateClassroomModal from '@/components/admin/modal/classroom/create-update-classroom-modal';
import DeleteClassroomModal from '@/components/admin/modal/classroom/delete-classroom-modal';
function AdminModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateUpdateClassroomModal />
      <DeleteClassroomModal />
    </>
  )
}

export default AdminModalProvider;
