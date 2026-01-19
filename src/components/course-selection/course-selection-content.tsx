"use client"
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const newCourses = [
  {
    id: 1,
    title: "CAB Toán Học",
    description: "Học Toán online với giáo viên\ntrường điểm",
    students: "6826 bạn đang học",
    image: "/courses/cab-toan-hoc.png",
    teachers: [
      { name: "Teacher 1", avatar: "/placeholder.png" },
      { name: "Teacher 2", avatar: "/placeholder.png" },
      { name: "Teacher 3", avatar: "/placeholder.png" }
    ],
    href: "/main/khoa-hoc/toan-hoc"
  },
  {
    id: 2,
    title: "CAB Tiếng Việt",
    description: "Học Tiếng việt online với giáo\nviên trường điểm",
    students: "2826 bạn đang học",
    image: "/courses/cab-tieng-viet.png",
    teachers: [
      { name: "Teacher 1", avatar: "/placeholder.png" },
      { name: "Teacher 2", avatar: "/placeholder.png" },
      { name: "Teacher 3", avatar: "/placeholder.png" }
    ],
    href: "/main/khoa-hoc/tieng-viet"
  }
];

const englishCourses = [
  {
    id: 1,
    title: "CAB Kid 1",
    description: "Mỗi buổi học bao gồm 01 video bài giảng hoặc bài hát,...",
    teachers: "Giáo viên giảng dạy",
    teacherNames: ["Linda Lewis", "David Henrry"],
    image: "/courses/cab-kid-1-course.png",
    href: "/main/khoa-hoc/tieng-anh-lop-1"
  },
  {
    id: 2,
    title: "CAB Kid 2",
    description: "Mỗi buổi học bao gồm 01 video bài giảng hoặc bài hát,...",
    teachers: "Giáo viên giảng dạy",
    teacherNames: ["Michel Wang"],
    image: "/courses/cab-kid-2-course.png",
    href: "/main/khoa-hoc/tieng-anh-lop-2"
  },
  {
    id: 3,
    title: "CAB Kid 3",
    description: "Mỗi buổi học bao gồm 01 video bài giảng hoặc bài hát,...",
    teachers: "Giáo viên giảng dạy",
    teacherNames: ["Linda Lewis"],
    image: "/courses/cab-kid-3-course.png",
    href: "/main/khoa-hoc/tieng-anh-lop-3"
  },
  {
    id: 4,
    title: "CAB Kid 4",
    description: "Mỗi buổi học bao gồm 01 video bài giảng hoặc bài hát,...",
    teachers: "Giáo viên giảng dạy",
    teacherNames: ["Linda Lewis", "David Henrry"],
    image: "/courses/cab-kid-4-course.png",
    href: "/main/khoa-hoc/tieng-anh-lop-4"
  }
];

function CourseSelection() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Header with Rocking Horses */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Image
              key={i}
              src="/menu-icons/rocking-horse-1.png"
              alt="rocking horse"
              width={118 - (i - 1) * 10}
              height={118 - (i - 1) * 10}
              className="object-contain"
              style={{ 
                width: `${118 - (i - 1) * 10}px`,
                height: `${118 - (i - 1) * 10}px`
              }}
            />
          ))}
        </div>

        <Button 
          className="bg-[#BD5353] text-white rounded-full px-8 hover:bg-[#a04545] shadow-md font-semibold"
          onClick={() => router.push('/')}
        >
          🏠 Trang chủ
        </Button>
      </div>

      {/* New Courses Section */}
      <div className="space-y-4">
        <h2 className="text-[32px] font-bold text-[#D12828] leading-[1.21]">
          Khóa học mới ra mắt
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {newCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-[50px] border-[5px] border-[#E87D7D] p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all relative"
              onClick={() => router.push(course.href)}
            >
              {/* New Badge */}
              <div className="absolute -top-6 right-12">
                <Image
                  src="/courses/new-badge.png"
                  alt="new"
                  width={75}
                  height={74}
                  className="object-contain"
                />
              </div>

              <div className="flex gap-6">
                {/* Course Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={243}
                    height={204}
                    className="rounded-[20px] object-cover"
                  />
                </div>

                {/* Course Info */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <h3 className="text-[32px] font-extrabold text-[#1D5995] mb-3 leading-[1.21]">
                      {course.title}
                    </h3>
                    <p className="text-[22px] font-medium text-[#000000] mb-4 leading-[1.21] whitespace-pre-line">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Teachers */}
                    <div className="flex items-center gap-2">
                      {course.teachers.slice(0, 3).map((teacher, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full border border-black overflow-hidden"
                        >
                          <Image
                            src={teacher.avatar}
                            alt={teacher.name}
                            width={32}
                            height={30}
                            className="object-cover"
                          />
                        </div>
                      ))}
                      <span className="text-[22px] font-medium text-[#535B62] leading-[1.21]">
                        {course.students}
                      </span>
                    </div>

                    {/* Learn Now Button */}
                    <Button className="bg-[#E87D7D] text-white rounded-[20px] px-12 py-6 hover:bg-[#d16a6a] font-bold text-[25px] leading-[1.21]">
                      Học ngay
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* English Courses Section */}
      <div className="space-y-4">
        <h2 className="text-[32px] font-bold text-[#D12828] leading-[1.21]">
          Khóa học Tiếng Anh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {englishCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-[50px] border-[5px] border-[#E87D7D] p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
              onClick={() => router.push(course.href)}
            >
              {/* Course Image */}
              <div className="rounded-[20px] overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-purple-100 p-8">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={270}
                  height={144}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Course Info */}
              <div className="space-y-3">
                <h3 className="text-[28px] font-semibold text-[#1D5995] leading-[1.21]">
                  {course.title}
                </h3>
                <p className="text-[22px] font-semibold text-[#5A5656] leading-[1.21]">
                  {course.description}
                </p>

                {/* Teachers Section */}
                <div className="space-y-2 pt-2">
                  <p className="text-[18px] font-semibold text-[#1D5995] leading-[1.21]">
                    {course.teachers}
                  </p>
                  {course.teacherNames.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-black overflow-hidden">
                        <Image
                          src="/placeholder.png"
                          alt={name}
                          width={32}
                          height={30}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[18px] font-normal text-[#5A5656] leading-[1.21]">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Course Icon */}
                <div className="flex justify-end pt-2">
                  <Image
                    src={course.image}
                    alt="icon"
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-16"></div>
    </div>
  );
}

export default CourseSelection;
