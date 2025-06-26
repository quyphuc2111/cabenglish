"use server";

import {
  createUnitAdminDataByClassId,
  getAllUnitsAdminDataByClassId,
  updateUnitAdminDataByClassId
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

export async function getSingleUnitByClassId(classId: number | string) {
  try {
    const result = await getSingleUnitAdminDataByClassId(classId);
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu unit"
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

export async function updateUnitByClassId({
  unitData,
  classId
}: {
  unitData: UnitsFormValues;
  classId: number;
}) {
  if (!classId) {
    throw new Error('classId is required');
  }

  if (!unitData.unitId) {
    throw new Error('unitId is required for update');
  }

  try {
    const result = await updateUnitAdminDataByClassId({
      unitId: unitData.unitId,
      unitData: {
        ...unitData,
        classId: classId
      },
      classId
    });

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Update unit error:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : "Có lỗi xảy ra khi cập nhật unit"
    };
  }
}

export async function createManyUnitsByClassId({
  unitsData,
  classId
}: {
  unitsData: UnitsFormValues[];
  classId: number;
}) {
  if (!classId) {
    throw new Error('classId is required');
  }

  if (!unitsData || unitsData.length === 0) {
    throw new Error('Units data is required');
  }

  try {
    const formattedUnits = unitsData.map(unit => ({
      ...unit,
      classId: classId
    }));

    const result = await createUnitAdminDataByClassId({
      unitData: formattedUnits,
      classId
    });

    return { 
      success: true, 
      data: result.data,
      message: `Đã tạo thành công ${unitsData.length} unit(s)`
    };
  } catch (error) {
    console.error('Create many units error:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : "Có lỗi xảy ra khi tạo units"
    };
  }
}


