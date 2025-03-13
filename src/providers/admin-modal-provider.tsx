"use client"
import React, { useEffect, useState } from 'react'

import CreateUpdateClassroomModal from '@/components/admin/modal/classroom/create-update-classroom-modal';
import DeleteClassroomModal from '@/components/admin/modal/classroom/delete-classroom-modal';
import CreateUpdateSchoolWeekModal from '@/components/admin/modal/school-week/create-update-schoolweek-modal';
import DeleteSchoolWeekModal from '@/components/admin/modal/school-week/delete-schoolweek-modal';
import CreateUpdateNotiTypeModal from '@/components/admin/modal/notitype/create-update-notitype-modal';
import DeleteNotiTypeModal from '@/components/admin/modal/notitype/delete-notitype-modal';
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
      <CreateUpdateSchoolWeekModal />
      <DeleteSchoolWeekModal />
      <CreateUpdateNotiTypeModal />
      <DeleteNotiTypeModal />
    </>
  )
}

export default AdminModalProvider;
