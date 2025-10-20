"use client";

import React, { useMemo, memo } from "react";
import { useUserInfo } from "@/hooks/useUserInfo";
import { AgeGroupSection, Lesson } from "./age-group-section";
import { useTranslation } from "react-i18next";

interface NewCurrentAndNextLectureProps {
  courseData: any[];
  classroomData: any[];
  userId: string | undefined;
  onLikeUpdate?: (lessonId: number, newLikeCount: number) => void;
}

const NewCurrentAndNextLecture = memo(function NewCurrentAndNextLecture({
  courseData,
  classroomData,
  userId,
  onLikeUpdate,
}: NewCurrentAndNextLectureProps) {
  const { data: userInfo } = useUserInfo(userId);
  const { t } = useTranslation();
  // Memoize computed data to prevent recalculation on re-renders
  const { currentLecturesByClass, nextLecturesByClass, statsPerClass } =
    useMemo(() => {
      if (!courseData || courseData.length === 0) {
        return {
          currentLecturesByClass: {},
          nextLecturesByClass: {},
          statsPerClass: {},
        };
      }

      // Group courses by classId using reduce
      const coursesByClass = courseData.reduce<Record<string, any[]>>(
        (acc, course) => {
          if (!acc[course.classId]) {
            acc[course.classId] = [];
          }
          acc[course.classId].push(course);
          return acc;
        },
        {}
      );

      // Sort courses within each class
      Object.keys(coursesByClass).forEach((classId) => {
        coursesByClass[classId].sort((a: any, b: any) => {
          if (a.unitId !== b.unitId) return a.unitId - b.unitId;
          return a.lessonOrder - b.lessonOrder;
        });
      });

      const currentLecturesByClass: Record<string, Lesson[]> = {};
      const nextLecturesByClass: Record<string, Lesson[]> = {};
      const statsPerClass: Record<
        string,
        { total: number; completed: number }
      > = {};

      // Process each class separately
      Object.entries(coursesByClass).forEach(([classId, classCourses]) => {
        const currentLectures: Lesson[] = [];
        const nextLectures: Lesson[] = [];

        // Calculate stats
        const totalLessons = classCourses.length;
        const completedLessons = classCourses.filter(
          (course: any) => course.progress === 1
        ).length;

        statsPerClass[classId] = {
          total: totalLessons,
          completed: completedLessons,
        };

        // Find lessons in progress for this class (progress > 0 and progress < 1)
        const inProgressLessons = classCourses.filter(
          (course: any) =>
            course.progress > 0 && course.progress < 1 && !course.isLocked
        );

        if (inProgressLessons.length > 0) {
          // Add all in-progress lessons to current
          currentLectures.push(...inProgressLessons);

          // Determine next lectures based on number of current lectures
          if (inProgressLessons.length === 1) {
            const currentLesson = inProgressLessons[0];

            const nextLessons = classCourses.filter(
              (course: any) =>
                course.progress === 0 &&
                course.lessonOrder > currentLesson.lessonOrder
            );

            nextLessons.sort((a: any, b: any) => {
              return Number(a.lessonOrder) - Number(b.lessonOrder);
            });
            nextLectures.push(...nextLessons);
          } else {
            // If multiple lessons in progress, get all lessons with progress = 0
            const allNextLessons = classCourses.filter(
              (course: any) => course.progress === 0
            );

            allNextLessons.sort((a: any, b: any) => {
              return Number(a.lessonOrder) - Number(b.lessonOrder);
            });

            nextLectures.push(...allNextLessons);
          }
        } else {
          // If no lessons in progress, current lectures remain empty
          // Next lectures will be the first lesson by lessonOrder
          const notStartedLessons = classCourses.filter(
            (course: any) => course.progress === 0
          );

          if (notStartedLessons.length > 0) {
            notStartedLessons.sort((a: any, b: any) => {
              return Number(a.lessonOrder) - Number(b.lessonOrder);
            });

            // Add all lessons to next lectures (no current lectures)
            nextLectures.push(...notStartedLessons);
          }
        }

        // Remove duplicates from nextLectures
        const uniqueNextLectures = nextLectures.filter(
          (lecture, index, self) =>
            index === self.findIndex((l) => l.lessonId === lecture.lessonId)
        );

        // Sort current lectures by lessonOrder only
        const sortedCurrentLectures = currentLectures.sort((a: any, b: any) => {
          return Number(a.lessonOrder) - Number(b.lessonOrder);
        });

        // Sort next lectures by lessonOrder only
        const sortedNextLectures = uniqueNextLectures.sort((a: any, b: any) => {
          return Number(a.lessonOrder) - Number(b.lessonOrder);
        });

        currentLecturesByClass[classId] = sortedCurrentLectures;
        nextLecturesByClass[classId] = sortedNextLectures;
      });

      if (userInfo?.mode === "default") {
        Object.keys(currentLecturesByClass).forEach((classId) => {
          if (currentLecturesByClass[classId]?.length > 0) {
            currentLecturesByClass[classId] = [
              currentLecturesByClass[classId][0],
            ];
          }
          if (nextLecturesByClass[classId]?.length > 0) {
            nextLecturesByClass[classId] = [nextLecturesByClass[classId][0]];
          }
        });
      }

      return {
        currentLecturesByClass,
        nextLecturesByClass,
        statsPerClass,
      };
    }, [courseData, userInfo?.mode]);

  // Get classroom names mapping
  const getClassroomName = (classId: string) => {
    const classroom = classroomData.find(
      (c) => c.class_id === Number(classId)
    );
    return classroom?.classname || `Lớp ${classId}`;
  };

  // Check if we have any classes with lectures (current or next)
  const hasAnyLectures = Object.keys(currentLecturesByClass).some((classId) => {
    const currentLectures = currentLecturesByClass[classId] || [];
    const nextLectures = nextLecturesByClass[classId] || [];
    return currentLectures.length > 0 || nextLectures.length > 0;
  });

  // Color mapping for each class
  const getColorForClass = (
    index: number
  ): "primary" | "secondary" | "accent" => {
    const colors: ("primary" | "secondary" | "accent")[] = [
      "primary",
      "secondary",
      "accent",
    ];
    return colors[index % colors.length];
  };

  if (!hasAnyLectures) {
    return (
      <div className="w-full overflow-hidden py-2 min-w-0">
        <div className="relative z-10 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col items-center justify-center gap-4 py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
              <p className="text-4xl sm:text-5xl">📚</p>
            </div>
            <div className="text-center px-2">
              <p className="text-gray-800 font-bold text-lg sm:text-xl md:text-2xl mb-2">
                {
                  t("noLessonsYet")
                }
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {
                  t("startANewLesson")
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <header className="text-center space-y-2 py-3">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {
            t("listOfLecture")
          }
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          {
            t("trackTheLearningProgressOfEachClass")
          }
        </p>
      </header>

      <div className="space-y-8">
        {(() => {
          // Get all unique class IDs from both current and next lectures
          const allClassIds = new Set([
            ...Object.keys(currentLecturesByClass),
            ...Object.keys(nextLecturesByClass),
          ]);

          return Array.from(allClassIds).map((classId, index) => {
            const lectures = currentLecturesByClass[classId] || [];
            const nextLectures = nextLecturesByClass[classId] || [];
            const stats = statsPerClass[classId] || { total: 0, completed: 0 };

            // Show class even if no current lectures but has next lectures
            if (lectures.length === 0 && nextLectures.length === 0) return null;

            return (
              <React.Fragment key={classId}>
                <AgeGroupSection
                  ageRange={getClassroomName(classId)}
                  currentLessons={lectures}
                  nextLessons={nextLectures}
                  color={getColorForClass(index)}
                  totalLessons={stats.total}
                  completedLessons={stats.completed}
                  t={t}
                />
                {index < allClassIds.size - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
                )}
              </React.Fragment>
            );
          });
        })()}
      </div>
    </div>
  );
});

export default NewCurrentAndNextLecture;

