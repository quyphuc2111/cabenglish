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
import DeleteLessonModal from "@/components/admin/modal/lessons/delete-lesson-modal";
import DeleteUnitsModal from "@/components/admin/modal/units/delete-units-modal";
import CreateUpdateSectionContentModal from "@/components/admin/modal/section-content/create-update-section-content-modal";
import DeleteSectionContentModal from "@/components/admin/modal/section-content/delete-section-content-modal";
import CreateUpdateNotiModal from "@/components/admin/modal/noti/create-update-noti-modal";
import SendNotiModal from "@/components/admin/modal/noti/send-noti-modal";
import DeleteNotiModal from "@/components/admin/modal/noti/delete-noti-modal";
import ImportLessonModal from "@/components/admin/modal/lessons/import-lesson-modal";
import ExportLessonModal from "@/components/admin/modal/lessons/export-lesson-modal";
import ExportSectionModal from "@/components/admin/modal/sections/export-section-modal";
import ImportSectionContentModal from "@/components/admin/modal/section-content/import-section-content-modal";
import ExportSectionContentModal from "@/components/admin/modal/section-content/export-section-content-modal";
import ImportUnitsModal from "@/components/admin/modal/units/import-units-modal";
import ExportUnitsModal from "@/components/admin/modal/units/export-units-modal";
import { ErrorDetailsModal } from "@/components/common/error-details-modal";
import { useModal } from "@/hooks/useModalStore";
import ExportNotiTypeModal from "@/components/admin/modal/notitype/export-notitype-modal";
import { CreateUpdateGameTopicModal } from "@/components/admin/modal/topics/create-update-game-topic-modal";
import { DeleteGameTopicModal } from "@/components/admin/modal/topics/delete-game-topic-modal";
import ExportGameTopicsModal from "@/components/admin/modal/topics/export-game-topics-modal";
import ImportGameTopicsModal from "@/components/admin/modal/topics/import-game-topics-modal";
import { CreateUpdateGameAgeModal } from "@/components/admin/modal/ages/create-update-game-age-modal";
import { DeleteGameAgeModal } from "@/components/admin/modal/ages/delete-game-age-modal";
import ExportGameAgesModal from "@/components/admin/modal/ages/export-game-ages-modal";
import ImportGameAgesModal from "@/components/admin/modal/ages/import-game-ages-modal";
import { ViewGameModal } from "@/components/admin/modal/games/view-game-modal";
import { DeleteGameModal } from "@/components/admin/modal/games/delete-game-modal";
import { CreateUpdateGameModal } from "@/components/admin/modal/games/create-update-game-modal";
import ExportGamesModal from "@/components/admin/modal/games/export-games-modal";
import ImportGamesModal from "@/components/admin/modal/games/import-games-modal";

function AdminModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, type, data, onClose } = useModal();

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
      <ExportNotiTypeModal />

      {/* units */}
      <CreateUpdateUnitsModal />
      <DeleteUnitsModal />
      <ImportUnitsModal />
      <ExportUnitsModal />

      {/* lesson */}
      <CreateUpdateLessonModal />
      <DeleteLessonModal />
      <ImportLessonModal />
      <ExportLessonModal />
     
      {/* section */}
      <CreateUpdateSectionModal />
      <ImportSectionModal />
      <DeleteSectionModal  />
      <ExportSectionModal />

      {/* section content */}
      <CreateUpdateSectionContentModal />
      <DeleteSectionContentModal />
      <ImportSectionContentModal />
      <ExportSectionContentModal />

      {/* noti */}
      <CreateUpdateNotiModal />
      <DeleteNotiModal />
      <SendNotiModal />

      {/* game topics */}
      <CreateUpdateGameTopicModal />
      <DeleteGameTopicModal />
      <ExportGameTopicsModal />
      <ImportGameTopicsModal />

      {/* game ages */}
      <CreateUpdateGameAgeModal />
      <DeleteGameAgeModal />
      <ExportGameAgesModal />
      <ImportGameAgesModal />

      {/* games */}
      <ViewGameModal />
      <CreateUpdateGameModal />
      <DeleteGameModal />
      <ExportGamesModal />
      <ImportGamesModal />

      {/* error details */}
      <ErrorDetailsModal
        isOpen={isOpen && type === "errorDetails"}
        onClose={onClose}
        error={data?.error || null}
        title={data?.errorTitle || "Chi tiết lỗi"}
      />

    </>



  );
}

export default AdminModalProvider;
