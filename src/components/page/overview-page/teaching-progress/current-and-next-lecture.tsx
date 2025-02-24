import CourseCard from '@/components/course-card/course-card'
import Image from 'next/image'
import React, { Fragment } from 'react'

function CurrentAndNextLecture({ courseData, t }: { courseData: any[], t: any }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full lg:w-1/2">
    <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:border-l border-[#e969ad]/50 lg:px-5">
      <div className="flex items-center gap-3 ">
        <Image 
          src="/book_light.png" 
          alt="book_light" 
          width={35} 
          height={35} 
          priority
        />
        <p className="text-xl">{t('lectureBeingTaught')}</p>
      </div>
      <div className=" flex justify-center">
        {courseData.filter(i => i.courseLike == 668).map((courseItem, index) => (
          <Fragment key={index}>
            <CourseCard {...courseItem} />
          </Fragment>
        ))}
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
        <p className="text-xl">{t('nextLecture')}</p>
      </div>
      <div className=" flex justify-center">
        {courseData.filter(i => i.courseLike == 668).map((courseItem, index) => (
          <Fragment key={index}>
            <CourseCard {...courseItem} />
          </Fragment>
        ))}
      </div>
    </div>
  </div>
  )
}

export default CurrentAndNextLecture

