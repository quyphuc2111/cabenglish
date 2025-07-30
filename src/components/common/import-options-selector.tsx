import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ImportOption {
  id: string;
  title: string;
  description: string;
  available?: boolean;
  comingSoon?: boolean;
}

interface ImportOptionsSelectorProps {
  options: ImportOption[];
  value: string;
  onChange: (value: string) => void;
  title?: string;
  className?: string;
}

export function ImportOptionsSelector({
  options,
  value,
  onChange,
  title = "Tùy chọn import",
  className = ''
}: ImportOptionsSelectorProps) {
  const isOptionAvailable = (option: ImportOption) => {
    return option.available !== false && !option.comingSoon;
  };

  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        {title}
      </h3>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-2"
      >
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-start space-x-3 rounded-lg border p-3 transition-colors duration-200
              ${!isOptionAvailable(option) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
              ${value === option.id && isOptionAvailable(option) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
            `}
          >
            <RadioGroupItem
              value={option.id}
              id={option.id}
              className="text-blue-500 mt-0.5"
              disabled={!isOptionAvailable(option)}
            />
            <Label
              htmlFor={option.id}
              className={`flex-1 ${!isOptionAvailable(option) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium flex items-center gap-2">
                {option.title}
                {option.comingSoon && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                    Sắp ra mắt
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {option.description}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
} 