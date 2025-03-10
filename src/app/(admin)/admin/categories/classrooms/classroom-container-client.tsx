"use client";
import SearchInput from "@/components/admin/search-input";
import { Button } from "@/components/ui/button";
import React from "react";

function ClassroomContainerClient() {
//   const classroomData = [
//     {
//       value: "next.js",
//       label: "Next.js"
//     },
//     {
//       value: "sveltekit",
//       label: "SvelteKit"
//     },
//     {
//       value: "nuxt.js",
//       label: "Nuxt.js"
//     },
//     {
//       value: "remix",
//       label: "Remix"
//     },
//     {
//       value: "astro",
//       label: "Astro"
//     },
//     {
//         value: "next.js",
//         label: "Next.js"
//       },
//       {
//         value: "sveltekit",
//         label: "SvelteKit"
//       },
//       {
//         value: "nuxt.js",
//         label: "Nuxt.js"
//       },
//       {
//         value: "remix",
//         label: "Remix"
//       },
//       {
//         value: "astro",
//         label: "Astro"
//       },
      
//   ];

  const classroomData = Array.from({length: 20}, (_, i) => ({
    value: `classroom-${i}`,
    label: `Lớp học ${i}`
  }))

  return (
    <div className="bg-white rounded-lg p-10">
        <div className="flex justify-between items-center">
        <SearchInput data={classroomData} placeholder="Tìm kiếm lớp học" />
        <div className="flex gap-5">
            <Button variant="outline">Xuất dữ liệu</Button>
            <Button variant="outline">Nhập dữ liệu</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Tạo mới lớp học</Button>
        </div>
        </div>
    </div>
  );
}

export default ClassroomContainerClient;
