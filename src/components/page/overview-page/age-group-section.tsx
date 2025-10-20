"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Sparkles } from "lucide-react";
import { Empty } from "@/components/empty";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useNavigationStore } from "@/store/navigationStore";

export interface Lesson {
  lessonId: number;
  lessonName: string;
  unitId: number;
  lessonOrder: number;
  progress: number;
  classId: number;
  isLocked: boolean;
  numLiked?: number;
  [key: string]: any;
}

export interface AgeGroupSectionProps {
  ageRange: string;
  currentLessons: Lesson[];
  nextLessons: Lesson[];
  color: "primary" | "secondary" | "accent";
  totalLessons?: number;
  completedLessons?: number;
  t: (key: string) => string;
}

const colorClasses = {
  primary: {
    badge: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
    icon: "text-blue-500",
    progress: "bg-gradient-to-r from-blue-500 to-cyan-500",
    border: "border-blue-200",
    headerBg: "from-blue-50 to-cyan-50",
  },
  secondary: {
    badge: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
    icon: "text-purple-500",
    progress: "bg-gradient-to-r from-purple-500 to-pink-500",
    border: "border-purple-200",
    headerBg: "from-purple-50 to-pink-50",
  },
  accent: {
    badge: "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
    icon: "text-orange-500",
    progress: "bg-gradient-to-r from-orange-500 to-amber-500",
    border: "border-orange-200",
    headerBg: "from-orange-50 to-amber-50",
  },
};

function LessonCard({
  lesson,
  color,
  onClick,
}: {
  lesson: Lesson;
  color: "primary" | "secondary" | "accent";
  onClick?: () => void;
}) {
  const colors = colorClasses[color];
  const progressPercent = Math.round((lesson.progress || 0) * 100);

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-base leading-tight text-pretty">
              {lesson.lessonName}
            </h4>
            <p className="text-sm text-muted-foreground">
              Unit {lesson.unitId} - Bài {lesson.lessonOrder}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>30 phút</span>
            </div>
          </div>
          <div className={`rounded-full p-2 ${colors.badge}`}>
            <BookOpen className="h-4 w-4" />
          </div>
        </div>
        {lesson.progress !== undefined && lesson.progress > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tiến độ</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full ${colors.progress} transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AgeGroupSection({
  ageRange,
  currentLessons,
  nextLessons,
  color,
  totalLessons = 0,
  completedLessons = 0,
  t,
}: AgeGroupSectionProps) {
  const colors = colorClasses[color];
  const completionRate =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const router = useRouter();
  const { setPreviousPage, setOverviewState } = useNavigationStore();

  const handleLessonClick = useCallback(
    (lessonId: number) => {
      // Lưu trạng thái trang tổng quan trước khi chuyển trang
      const scrollPosition = window.scrollY;

      // Lưu thông tin trang trước
      setPreviousPage({
        url: "/tong-quan",
        title: "Tổng quan",
        state: {
          scrollPosition,
        },
      });

      // Lưu trạng thái trang tổng quan
      setOverviewState({
        scrollPosition,
      });

      // Chuyển trang
      router.push(`/lesson/${lessonId}`);
    },
    [router, setPreviousPage, setOverviewState]
  );

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className={`flex items-center justify-between gap-4 bg-gradient-to-r ${colors.headerBg} rounded-xl p-4 border ${colors.border}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${colors.badge} shadow-md`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{ageRange}</h2>
            <p className="text-xs text-gray-600">
              {totalLessons > 0 && (
                <span>{completedLessons}/{totalLessons} bài hoàn thành ({completionRate}%)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Current | Next */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bài học đang dạy */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`h-1 w-8 rounded-full ${colors.progress} shadow-sm`} />
            <h3 className="text-base font-bold text-gray-800">{t("taughtLesson")}</h3>
            {currentLessons.length > 0 && (
              <Badge className={`ml-auto ${colors.badge} shadow-sm text-xs`}>
                {currentLessons.length}
              </Badge>
            )}
          </div>

          {currentLessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-semibold text-gray-700">Chưa có bài học</p>
              <p className="text-xs text-gray-500 mt-1">Chưa có bài học đang dạy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentLessons.map((lesson) => {
                const progressPercent = Math.round((lesson.progress || 0) * 100);
                return (
                  <Card
                    key={lesson.lessonId}
                    className={`overflow-hidden border ${colors.border} bg-gradient-to-br from-white to-gray-50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
                    onClick={() => handleLessonClick(lesson.lessonId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 ${colors.badge} shrink-0 shadow-sm`}>
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <h4 className="font-bold text-sm leading-tight text-gray-800 line-clamp-2">
                              {lesson.lessonName}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              Unit {lesson.unitId} - Bài {lesson.lessonOrder}
                            </p>
                          </div>
                          {lesson.progress !== undefined && lesson.progress > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Tiến độ</span>
                                <span className="font-bold text-gray-800">{progressPercent}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  className={`h-full ${colors.progress} transition-all duration-500`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Bài học tiếp theo */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`h-1 w-8 rounded-full ${colors.progress} opacity-50 shadow-sm`} />
            <h3 className="text-base font-bold text-gray-800">Bài học tiếp theo</h3>
            {nextLessons.length > 0 && (
              <Badge variant="outline" className={`ml-auto ${colors.border} text-gray-700 text-xs`}>
                {nextLessons.length}
              </Badge>
            )}
          </div>

          {nextLessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <Clock className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-semibold text-gray-700">Chưa có bài tiếp theo</p>
              <p className="text-xs text-gray-500 mt-1">Chưa có bài học được lên lịch</p>
            </div>
          ) : (
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {nextLessons.slice(0, 6).map((lesson) => (
                  <Card
                    key={lesson.lessonId}
                    className={`flex-none w-[200px] snap-start overflow-hidden border ${colors.border} bg-white transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
                    onClick={() => handleLessonClick(lesson.lessonId)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm leading-tight flex-1 text-gray-800 line-clamp-2">
                            {lesson.lessonName}
                          </h4>
                          <div className={`rounded p-1.5 ${colors.badge} shrink-0 shadow-sm`}>
                            <BookOpen className="h-3.5 w-3.5" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          Unit {lesson.unitId} - Bài {lesson.lessonOrder}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {nextLessons.length > 6 && (
                <div className="text-center mt-2">
                  <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                    + {nextLessons.length - 6} bài khác
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

