import React, { Fragment } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { DivideCircle } from "lucide-react";

interface CourseCardProps {
  courseTitle: string;
  courseImage: string;
  courseWeek: string;
  courseCategory: string;
  courseName: string;
  courseProgress: number;
  courseLike: number;
  className?: string;
}

function CourseCard({
  courseTitle,
  courseImage,
  courseWeek,
  courseCategory,
  courseName,
  courseProgress,
  courseLike,
  className
}: CourseCardProps) {
  const router = useRouter();

  const handleChooseCourse = () => {
    router.push(`/main/khoa-hoc/${courseName}`);
  };

  const getFlowerCount = (progress: number) => {
    return Math.ceil(progress / 25);
  };

  return (
    <div
      onClick={handleChooseCourse}
      className={cn(
        "px-3 py-4 bg-white rounded-2xl flex flex-col gap-2 shadow-course-inset border relative overflow-hidden cursor-pointer",
        className
      )}
    >
      <h2 className="text-lg font-bold">{courseTitle}</h2>
      <Image
        src={courseImage}
        alt={courseTitle}
        width={200}
        height={50}
        className="rounded-xl w-full aspect-[16/9] object-cover"
      />

      <div className="text-[#736E6E] text-sm flex justify-between">
        <span className="course-week">{courseWeek}</span>
        <span  className="course-category">{courseCategory}</span>
      </div>

      <h2 className="text-xl font-bold">{courseName}</h2>

      {/* <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-primary h-full rounded-full" 
            style={{width: `${courseProgress}%`}}
          />
        </div>
        <span className="text-sm font-medium">{courseProgress}%</span>
      </div> */}

      <div className="flex justify-between items-center">
      <div className="border-4 border-[#3EC474] w-1/2  rounded-tr-lg p-1 flex justify-around items-center">
        <div className=" bg-[#db8ab5]/50 rounded-tr-md px-2 py-1 w-2/3">
          <div className="flex items-center justify-between">
            {[...Array(getFlowerCount(courseProgress))].map((_, index) => (
              <Fragment key={index}>
                <Image src="/flower.png" alt="flower" width={11} height={17} />
              </Fragment>
            ))}
          </div>
        </div>
        <div className="ml-2">
        <Image src="/check_course.png" alt="flower" width={21} height={25} />
        </div>
        <div>
       
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Image src="/modal/heart.png" alt="likes" width={28} height={34} />
        <span className="text-sm text-gray-500">{courseLike}</span>
      </div>
      </div>


    </div>
  );
}

export default CourseCard;
