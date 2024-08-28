import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SuggestActivities from "@/components/suggest-activities";
import UnitsSection from "@/components/units-section";

function MainUnit() {
  return (
    <ContentLayout title="GiftShop" type="course">
      {/* <div>
        <h2 className="font-semibold text-xl mb-3">Bài học đề xuất</h2>
        <div className="grid lg:grid-cols-2">
          <SuggestActivities />
        </div>
      </div> */}

      <div className="mt-7">
      <UnitsSection />
      </div>
    </ContentLayout>
  );
}

export default MainUnit;
