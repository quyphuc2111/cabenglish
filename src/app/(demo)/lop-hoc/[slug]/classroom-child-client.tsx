"use client"
import React from 'react'
import { BreadcrumbLayout } from '@/components/admin-panel/breadcrumb-layout'
import ClassroomWrapper from '@/components/common/classroom-wrapper'
import FilterClassroom from '@/components/common/filter-classroom'
import { PaginatedContent } from '@/components/common/paginated-content';
import CourseCard from '@/components/course-card/course-card';
import { formatSlug } from '@/lib/utils'
import { LessonType } from '@/types/lesson'
import LessonCard from '@/components/lesson/lesson-card'
import { getSectionDataByLessonId } from '@/actions/sectionAction'
import { SectionType } from '@/types/section'
import { useRouter } from 'next/navigation'

// const courseData = [
//   {
//     courseTitle: "Unit 1 - Bài học: Từ vựng",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 2 - Bài học: Chào hỏi",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 3 - Bài học: Màu sắc",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 4 - Bài học: Từ vựng",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 1 - Bài học: Từ vựng",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 2 - Bài học: Chào hỏi",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 3 - Bài học: Màu sắc",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 4 - Bài học: Từ vựng",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 1 - Bài học: Từ vựng",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 2 - Bài học: Chào hỏi",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 3 - Bài học: Màu sắc",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 4 - Bài học: Từ vựng",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "not_started"
//   },

//   {
//     courseTitle: "Unit 21 - Bài học: Từ vựng",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Uni8t 2 - Bài học: Chào hỏi",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit7 3 - Bài học: Màu sắc",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit8 4 - Bài học: Từ vựng",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 1 -7 Bài học: Từ vựng",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 2 - Bài6 học: Chào hỏi",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 3 - Bà5i học: Màu sắc",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 4 - B4ài học: Từ vựng",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 1 -3 Bài học: Từ vựng",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 2 - B2ài học: Chào hỏi",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 3 - Bài1 học: Màu sắc",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "not_started"
//   },
//   {
//     courseTitle: "Unit 4 - Bài học: Từ vựng",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "not_started"
//   }
// ];
function ClassroomChildClient({slug, lessonData, fetchSectionData}: {slug: string, lessonData: LessonType[], fetchSectionData: (lessonId: number) => Promise<SectionType[]>}) {
  const formattedSlug = formatSlug(slug);
  const router = useRouter()

  // Định dạng lại title để hiển thị
  const formatTitle = (slug: string) => {
    return decodeURIComponent(slug)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleLessonClick = async (lessonId: number) => {
    // onLessonSelect(lessonId)
    //  const sectionData = await fetchSectionData(lessonId)

    //  if(sectionData.data && sectionData.data.length > 0) {
        
    //  }
     router.push(`/lesson/${lessonId}`)
    //  console.log("sectionData", sectionData)

    //  if(sectionData.data > 0 ) {
    //     console.log("sectionData", sectionData)
    //  }
     
  }

// const handleLessonClick = async (lessonId: number) => {
//     try {
//       const sectionData = await getSectionDataByLessonId({
//         userId: userId,
//         lessonId: lessonId.toString()
//       });
//       console.log('Section data:', sectionData);
//       // Xử lý sectionData ở đây
//     } catch (error) {
//       console.error('Error fetching section data:', error);
//     }
//   }

  return (
    <BreadcrumbLayout title={formatTitle(formattedSlug)}>
      <ClassroomWrapper>
        <FilterClassroom />
        <PaginatedContent
          items={lessonData}
          itemsPerPage={8}
          renderItem={(lessonItem) => {
            const lessonItemData = {
                ...lessonItem,
                classRoomName: lessonItem.className
            }
            console.log("lessonItemData", lessonItemData)
            return (
                <LessonCard {...lessonItemData} onClick={() => handleLessonClick(lessonItem.lessonId)} />
            )
          }}
          itemInPage={[8, 16, 24, 32, 40]}
          rowPerPage={4}
        />
      </ClassroomWrapper>
    </BreadcrumbLayout>
  )
}

export default ClassroomChildClient