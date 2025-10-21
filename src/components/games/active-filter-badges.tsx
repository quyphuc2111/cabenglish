"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveFilterBadgesProps {
  selectedTopics: string[];
  topics: Array<{ value: string; label: string; emoji: string }>;
  onRemoveTopic: (topic: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterBadges({
  selectedTopics,
  topics,
  onRemoveTopic,
  onClearAll
}: ActiveFilterBadgesProps) {
  if (selectedTopics.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700">
          Đang lọc theo {selectedTopics.length} chủ đề
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedTopics.map((topicValue) => {
          const topic = topics.find(t => t.value === topicValue);
          if (!topic) return null;

          return (
            <button
              key={topicValue}
              onClick={() => onRemoveTopic(topicValue)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-xl",
                "bg-white border-2 border-purple-200",
                "hover:border-purple-400 hover:bg-purple-50",
                "transition-all hover:scale-105 shadow-sm"
              )}
            >
              <span className="text-base">{topic.emoji}</span>
              <span className="text-sm font-semibold text-gray-800">
                {topic.label}
              </span>
              <div className="w-5 h-5 rounded-full bg-purple-200 hover:bg-purple-300 flex items-center justify-center transition-colors">
                <X className="w-3 h-3 text-purple-700" strokeWidth={3} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

