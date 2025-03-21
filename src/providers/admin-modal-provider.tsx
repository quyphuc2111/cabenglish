"use client";
import React, { useEffect, useState } from "react";

import CreateUpdateClassroomModal from "@/components/admin/modal/classroom/create-update-classroom-modal";
import DeleteClassroomModal from "@/components/admin/modal/classroom/delete-classroom-modal";
import CreateUpdateSchoolWeekModal from "@/components/admin/modal/school-week/create-update-schoolweek-modal";
import DeleteSchoolWeekModal from "@/components/admin/modal/school-week/delete-schoolweek-modal";
import CreateUpdateNotiTypeModal from "@/components/admin/modal/notitype/create-update-notitype-modal";
import DeleteNotiTypeModal from "@/components/admin/modal/notitype/delete-notitype-modal";
import CreateUpdateUnitsModal from "@/components/admin/modal/units/create-update-units-modal";
import CreateUpdateLessonModal from "@/components/admin/modal/lessons/create-update-lesson-modal";
import ImportClassroomModal from "@/components/admin/modal/classroom/import-classroom-modal";
import ExportClassroomModal from "@/components/admin/modal/classroom/export-classroom-modal";
import ImportSchoolWeekModal from "@/components/admin/modal/school-week/import-schoolweek-modal";
import ExportSchoolWeekModal from "@/components/admin/modal/school-week/export-schoolweek-modal";
import ImportNotiTypeModal from "@/components/admin/modal/notitype/import-notitype-modal";
import CreateUpdateSectionModal from "@/components/admin/modal/sections/create-update-section-modal";
import ImportSectionModal from "@/components/admin/modal/sections/import-section-modal";
import DeleteSectionModal from "@/components/admin/modal/sections/delete-section-modal";
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
      {/* classroom */}
      <CreateUpdateClassroomModal />
      <DeleteClassroomModal />
      <ImportClassroomModal />
      <ExportClassroomModal />

      {/* schoolweek */}
      <CreateUpdateSchoolWeekModal />
      <DeleteSchoolWeekModal />
      <ImportSchoolWeekModal />
      <ExportSchoolWeekModal />

      {/* notitype */}
      <CreateUpdateNotiTypeModal />
      <DeleteNotiTypeModal />
      <ImportNotiTypeModal />

      {/* units */}
      <CreateUpdateUnitsModal />

      {/* lesson */}
      <CreateUpdateLessonModal />
   
     
      {/* section */}
      <CreateUpdateSectionModal />
      <ImportSectionModal />
      <DeleteSectionModal  />

    </>



  );
}

export default AdminModalProvider;
