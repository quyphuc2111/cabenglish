import { memo, useRef, useEffect, useState } from "react";
import { LessonType } from "@/types/lesson";

interface VirtualizedLessonListProps {
  lessons: LessonType[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (lesson: LessonType, index: number) => React.ReactNode;
}

// Virtual scrolling component cho mobile performance với nhiều lessons
const VirtualizedLessonList = memo(
  ({
    lessons,
    itemHeight,
    containerHeight,
    renderItem
  }: VirtualizedLessonListProps) => {
    const [scrollTop, setScrollTop] = useState(0);
    const scrollElementRef = useRef<HTMLDivElement>(null);

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      lessons.length
    );

    const visibleItems = lessons.slice(startIndex, endIndex);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    };

    const totalHeight = lessons.length * itemHeight;
    const offsetY = startIndex * itemHeight;

    return (
      <div
        ref={scrollElementRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((lesson, index) => (
              <div
                key={lesson.lessonId}
                style={{ height: itemHeight }}
                className="flex items-center"
              >
                {renderItem(lesson, startIndex + index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

VirtualizedLessonList.displayName = "VirtualizedLessonList";

export default VirtualizedLessonList;
