"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Topic {
  value: string;
  label: string;
  emoji: string;
  count: number;
}

interface TopicFilterDropdownProps {
  selectedTopics: string[];
  topics: Topic[];
  onChange: (topics: string[]) => void;
}

export function TopicFilterDropdown({
  selectedTopics,
  topics,
  onChange
}: TopicFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedTopics);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempSelected(selectedTopics);
  }, [selectedTopics]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setTempSelected(selectedTopics); // Reset to current selection
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, selectedTopics]);

  const toggleTopic = (topicValue: string) => {
    setTempSelected(prev => 
      prev.includes(topicValue)
        ? prev.filter(t => t !== topicValue)
        : [...prev, topicValue]
    );
  };

  const handleApply = () => {
    onChange(tempSelected);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempSelected([]);
    onChange([]);
    setIsOpen(false);
  };

  const selectedCount = selectedTopics.length;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between",
          "border-2 focus:outline-none",
          "bg-white hover:border-gray-300",
          selectedCount > 0
            ? "border-purple-400 bg-purple-50/50 font-semibold"
            : "border-gray-200",
          "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
        )}
      >
        <span className="flex items-center gap-2">
          <span>🌟</span>
          <span>
            {selectedCount === 0 
              ? "Lọc theo chủ đề" 
              : `${selectedCount} chủ đề được chọn`}
          </span>
        </span>
        <ChevronDown className={cn(
          "w-5 h-5 text-gray-400 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-purple-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-purple-100">
            <h3 className="font-bold text-gray-800 text-sm">Chọn chủ đề</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {tempSelected.length} chủ đề được chọn
            </p>
          </div>

          {/* Topics List */}
          <div className="max-h-80 overflow-y-auto">
            {topics.map((topic) => {
              const isSelected = tempSelected.includes(topic.value);
              
              return (
                <button
                  key={topic.value}
                  onClick={() => toggleTopic(topic.value)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center gap-3 transition-colors",
                    "hover:bg-purple-50 border-b border-gray-100 last:border-b-0",
                    isSelected && "bg-purple-50/50"
                  )}
                >
                  {/* Checkbox */}
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0",
                    isSelected
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500"
                      : "border-gray-300"
                  )}>
                    {isSelected && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>

                  {/* Topic Info */}
                  <div className="flex items-center gap-2 flex-1 text-left">
                    <span className="text-xl">{topic.emoji}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-purple-700" : "text-gray-700"
                    )}>
                      {topic.label}
                    </span>
                  </div>

                  {/* Count Badge */}
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold",
                    isSelected
                      ? "bg-purple-200 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {topic.count}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-sm text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 transition-all"
            >
              Xóa tất cả
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-all"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

