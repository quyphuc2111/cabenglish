import React from 'react';
import { CourseCarousel } from './src/components/carousel/course-carousel';

// Test data
const testLessons = [
  {
    lessonId: 1,
    lessonName: "Test Lesson 1",
    className: "Class A",
    unitName: "Unit 1",
    imageUrl: "/test-image.jpg",
    isLocked: false
  },
  {
    lessonId: 2,
    lessonName: "Test Lesson 2", 
    className: "Class B",
    unitName: "Unit 2",
    imageUrl: "/test-image2.jpg",
    isLocked: false
  }
];

export default function TestCarousel() {
  return (
    <div>
      <h1>Test CourseCarousel</h1>
      <CourseCarousel
        courseData={testLessons}
        onLessonClick={(lessonId) => console.log('Clicked lesson:', lessonId)}
        onSlideChange={(index) => console.log('Slide changed to:', index)}
        containerType="current"
        showArrows={true}
      />
    </div>
  );
}
