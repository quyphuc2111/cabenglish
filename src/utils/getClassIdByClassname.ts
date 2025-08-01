import { ClassroomType } from "@/types/classroom";

/**
 * Lấy class_id dựa trên classname từ danh sách classrooms
 * @param classrooms - Danh sách các classroom
 * @param classname - Tên lớp học cần tìm
 * @returns class_id nếu tìm thấy, undefined nếu không tìm thấy
 */
export function getClassIdByClassname(
  classrooms: ClassroomType[],
  classname: string
): number | undefined {
  if (!classrooms || !Array.isArray(classrooms) || !classname) {
    return undefined;
  }

  const classroom = classrooms.find(
    (classroom) => classroom.classname.toLowerCase() === classname.toLowerCase()
  );

  return classroom?.class_id;
}

/**
 * Lấy thông tin classroom đầy đủ dựa trên classname
 * @param classrooms - Danh sách các classroom
 * @param classname - Tên lớp học cần tìm
 * @returns ClassroomType nếu tìm thấy, undefined nếu không tìm thấy
 */
export function getClassroomByClassname(
  classrooms: ClassroomType[],
  classname: string
): ClassroomType | undefined {
  if (!classrooms || !Array.isArray(classrooms) || !classname) {
    return undefined;
  }

  return classrooms.find(
    (classroom) => classroom.classname.toLowerCase() === classname.toLowerCase()
  );
}