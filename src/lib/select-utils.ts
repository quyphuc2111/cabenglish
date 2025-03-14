import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Type định nghĩa cho options
export interface SelectOption {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  description?: string;
  className?: string;
}

/**
 * Format mảng dữ liệu thành options cho Select
 * @param arrayData Mảng dữ liệu gốc
 * @param keyLabel Key để lấy label
 * @param keyValue Key để lấy value
 * @param config Cấu hình thêm (optional)
 */
export const formatSelectOptions = <T extends Record<string, any>>(
  arrayData: T[],
  keyLabel: keyof T,
  keyValue: keyof T,
  config?: {
    disabled?: (item: T) => boolean;
    icon?: (item: T) => React.ComponentType<{ className?: string }> | undefined;
    description?: (item: T) => string | undefined;
    className?: (item: T) => string | undefined;
    labelFormatter?: (label: string) => string;
    valueFormatter?: (value: any) => string | number;
  }
): SelectOption[] => {
  return arrayData.map((item) => ({
    label: config?.labelFormatter 
      ? config.labelFormatter(String(item[keyLabel]))
      : String(item[keyLabel]),
    value: config?.valueFormatter 
      ? config.valueFormatter(item[keyValue])
      : item[keyValue],
    disabled: config?.disabled ? config.disabled(item) : false,
    icon: config?.icon ? config.icon(item) : undefined,
    description: config?.description ? config.description(item) : undefined,
    className: config?.className ? config.className(item) : undefined
  }));
};

/**
 * Tìm option theo value
 */
export const findSelectOption = (
  options: SelectOption[],
  value: string | number | null | undefined
): SelectOption | undefined => {
  if (!value) return undefined;
  return options.find((option) => option.value === value);
};

/**
 * Lấy label từ value
 */
export const getSelectLabel = (
  options: SelectOption[],
  value: string | number | null | undefined,
  defaultLabel: string = "Chưa chọn"
): string => {
  const option = findSelectOption(options, value);
  return option ? option.label : defaultLabel;
};

/**
 * Format options theo nhóm
 */
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export const formatSelectGroups = <T extends Record<string, any>>(
  arrayData: T[],
  keyLabel: keyof T,
  keyValue: keyof T,
  keyGroup: keyof T,
  config?: {
    groupFormatter?: (group: string) => string;
    labelFormatter?: (label: string) => string;
    valueFormatter?: (value: any) => string | number;
  }
): SelectGroup[] => {
  const groups = new Map<string, SelectOption[]>();

  arrayData.forEach((item) => {
    const groupKey = String(item[keyGroup]);
    const option: SelectOption = {
      label: config?.labelFormatter 
        ? config.labelFormatter(String(item[keyLabel]))
        : String(item[keyLabel]),
      value: config?.valueFormatter 
        ? config.valueFormatter(item[keyValue])
        : item[keyValue]
    };

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push(option);
  });

  return Array.from(groups.entries()).map(([group, options]) => ({
    label: config?.groupFormatter ? config.groupFormatter(group) : group,
    options
  }));
};

/**
 * Kiểm tra giá trị có trong options không
 */
export const isValidSelectValue = (
  options: SelectOption[],
  value: string | number | null | undefined
): boolean => {
  if (!value) return false;
  return options.some((option) => option.value === value);
};

/**
 * Format value trước khi submit
 */
export const formatSelectValue = (
  value: string | number | null | undefined,
  type: "string" | "number" = "string"
): string | number | null => {
  if (!value) return null;
  return type === "number" ? Number(value) : String(value);
};

// Ví dụ sử dụng:
/*
// Data gốc
const data = [
  { id: 1, name: "Option 1", status: "active" },
  { id: 2, name: "Option 2", status: "inactive" }
];

// Format basic
const basicOptions = formatSelectOptions(data, "name", "id");

// Format với config
const advancedOptions = formatSelectOptions(data, "name", "id", {
  disabled: (item) => item.status === "inactive",
  labelFormatter: (label) => `${label} ✨`,
  valueFormatter: (value) => String(value)
});

// Format theo nhóm
const groupedOptions = formatSelectGroups(data, "name", "id", "status", {
  groupFormatter: (group) => group.toUpperCase()
});

// Sử dụng trong component
<Select
  value={value}
  onValueChange={(newValue) => {
    // Format value trước khi lưu
    setValue(formatSelectValue(newValue, "number"));
  }}
>
  <SelectTrigger>
    <SelectValue placeholder="Chọn option" />
  </SelectTrigger>
  <SelectContent>
    {basicOptions.map((option) => (
      <SelectItem
        key={option.value}
        value={String(option.value)}
        disabled={option.disabled}
        className={option.className}
      >
        {option.icon && <option.icon className="mr-2 h-4 w-4" />}
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
*/