"use server";

import {
  createUnitAdminDataByClassId,
  getAllUnitsAdminDataByClassId
} from "@/actions/unitsAction";
import { UnitsFormValues } from "@/lib/validations/units";

export async function getAllUnitsByClassId(classId: number | string) {
  try {
    const result = await getAllUnitsAdminDataByClassId(classId);

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy dữ liệu unit"
    };
  }
}

export async function createUnitByClassId({
  unitData,
  classId
}: {
  unitData: UnitsFormValues;
  classId: number;
}) {
  if (!classId) {
    throw new Error('classId is required');
  }

  try {
    const result = await createUnitAdminDataByClassId({
      unitData: [{
        ...unitData,
        classId: classId
      }],
      classId
    });

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Create unit error:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : "Có lỗi xảy ra khi tạo unit"
    };
  }
}
