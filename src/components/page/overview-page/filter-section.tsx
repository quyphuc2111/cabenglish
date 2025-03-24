import { Suspense } from "react";
import FilterFacetServer from "@/components/common/filter-facet-server";

export async function FilterSection() {
  return (
    <div className="w-full md:w-3/4">
      <Suspense fallback={<div>Loading...</div>}>
        <FilterFacetServer />
      </Suspense>
    </div>
  );
} 