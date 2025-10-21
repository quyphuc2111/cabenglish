"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Topic {
  value: string;
  label: string;
  emoji: string;
  count: number;
}

interface TopicFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTopics: string[];
  topics: Topic[];
  onChange: (topics: string[]) => void;
}

export function TopicFilterBottomSheet({
  isOpen,
  onClose,
  selectedTopics,
  topics,
  onChange
}: TopicFilterBottomSheetProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedTopics);

  useEffect(() => {
    setTempSelected(selectedTopics);
  }, [selectedTopics]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleTopic = (topicValue: string) => {
    setTempSelected(prev => 
      prev.includes(topicValue)
        ? prev.filter(t => t !== topicValue)
        : [...prev, topicValue]
    );
  };

  const handleApply = () => {
    onChange(tempSelected);
    onClose();
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-slide-up">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Lọc theo chủ đề</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {tempSelected.length} chủ đề được chọn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Topics List */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          <div className="space-y-2">
            {topics.map((topic) => {
              const isSelected = tempSelected.includes(topic.value);
              
              return (
                <button
                  key={topic.value}
                  onClick={() => toggleTopic(topic.value)}
                  className={cn(
                    "w-full p-4 flex items-center gap-4 rounded-xl transition-all",
                    "border-2",
                    isSelected
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  )}
                >
                  {/* Checkbox */}
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                    isSelected
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500"
                      : "border-gray-300"
                  )}>
                    {isSelected && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>

                  {/* Topic Info */}
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <span className="text-2xl">{topic.emoji}</span>
                    <div>
                      <span className={cn(
                        "text-base font-semibold block",
                        isSelected ? "text-purple-700" : "text-gray-800"
                      )}>
                        {topic.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {topic.count} trò chơi
                      </span>
                    </div>
                  </div>

                  {/* Count Badge */}
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-bold",
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
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-5 bg-gray-50 border-t border-gray-200 safe-bottom">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-3.5 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all"
          >
            Xóa tất cả
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-all"
          >
            Áp dụng ({tempSelected.length})
          </button>
        </div>
      </div>
    </>
  );
}

