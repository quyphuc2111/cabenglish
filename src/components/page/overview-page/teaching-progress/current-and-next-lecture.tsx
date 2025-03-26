import CourseCard from '@/components/course-card/course-card'
import LessonCard from '@/components/lesson/lesson-card'
import Image from 'next/image'
import React, { Fragment } from 'react'

function CurrentAndNextLecture({ courseData, t }: { courseData: any[], t: any }) {
  // Lọc ra bài học đang dạy (0 < progress < 1)
  const currentLecture = courseData
    .filter(i => i.progress < 1 && i.progress > 0)
    .slice(-1)[0];

  // Tìm index của bài học đang dạy
  const currentIndex = courseData.findIndex(course => course.id === currentLecture?.id);
  
  // Lấy bài học tiếp theo (nếu có)
  const nextLecture = currentIndex !== -1 ? courseData[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row w-full lg:w-1/2">
      <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:border-l border-[#e969ad]/50 lg:px-5">
        <div className="flex items-center gap-3 ">
          <Image 
            src="/book_light.png" 
            alt="book_light" 
            width={35} 
            height={35} 
            priority
          />
          <p className="text-lg 3xl:text-xl">{t('lectureBeingTaught')}</p>
        </div>
        <div className="">
          {courseData.filter(i => i.progress < 1 && i.progress > 0).slice(-1).map((courseItem, index) => {
             const customCourse = {
              ...courseItem,
              classRoomName: courseItem.className,
            }
            return (
              <Fragment key={index}>
                <LessonCard {...customCourse} />
              </Fragment>
            )
          })}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:border-l border-[#e969ad]/50 lg:px-5">
        <div className="flex items-center gap-3 ">
          <Image 
            src="/person_rank.png" 
            alt="person_rank" 
            width={35} 
            height={35} 
            priority
          />
          <p className="text-lg 3xl:text-xl">{t('nextLecture')}</p>
        </div>
        <div className="">
          {nextLecture && (
            <LessonCard {...{
              ...nextLecture,
              classRoomName: nextLecture.className
            }} />
          )}
        </div>
      </div>
    </div>
  )
}

export default CurrentAndNextLecture

