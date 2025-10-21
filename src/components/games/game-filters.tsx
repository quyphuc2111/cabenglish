"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopicFilterDropdown } from "./topic-filter-dropdown";
import { TopicFilterBottomSheet } from "./topic-filter-bottom-sheet";

interface GameFiltersProps {
  ageGroup: string;
  selectedTopics: string[];
  search: string;
  topicCounts: Record<string, number>;
  onAgeGroupChange: (value: string) => void;
  onTopicsChange: (topics: string[]) => void;
  onSearchChange: (value: string) => void;
}

export default function GameFilters({
  ageGroup,
  selectedTopics,
  search,
  topicCounts,
  onAgeGroupChange,
  onTopicsChange,
  onSearchChange
}: GameFiltersProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const ageGroups = [
    { value: "", label: "Tất cả độ tuổi", emoji: "🎯" },
    { value: "3-4 tuổi", label: "3-4 tuổi", emoji: "👶" },
    { value: "4-5 tuổi", label: "4-5 tuổi", emoji: "🧒" },
    { value: "5-6 tuổi", label: "5-6 tuổi", emoji: "👦" }
  ];

  const topics = [
    { value: "Animals", label: "Động vật", emoji: "🐾", count: topicCounts["Animals"] || 0 },
    { value: "Numbers", label: "Số học", emoji: "🔢", count: topicCounts["Numbers"] || 0 },
    { value: "Colors", label: "Màu sắc", emoji: "🎨", count: topicCounts["Colors"] || 0 },
    { value: "Alphabet", label: "Chữ cái", emoji: "🔤", count: topicCounts["Alphabet"] || 0 },
    { value: "Shapes", label: "Hình khối", emoji: "⭐", count: topicCounts["Shapes"] || 0 },
    { value: "Music", label: "Âm nhạc", emoji: "🎵", count: topicCounts["Music"] || 0 },
    { value: "Logic", label: "Logic", emoji: "🧩", count: topicCounts["Logic"] || 0 },
    { value: "Memory", label: "Trí nhớ", emoji: "🧠", count: topicCounts["Memory"] || 0 }
  ];

  const hasActiveFilters = ageGroup !== "" || selectedTopics.length > 0 || search !== "";

  const clearFilters = () => {
    onAgeGroupChange("");
    onTopicsChange([]);
    onSearchChange("");
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-course-inset border-2 border-blue-100/50 p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg shadow-md">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Tìm kiếm & Lọc</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors">
            <Search className={cn(
              "w-5 h-5 transition-colors",
              search ? "text-blue-500" : "text-gray-400"
            )} />
          </div>
          <input
            type="text"
            placeholder="Tìm trò chơi..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-xl transition-all",
              "border-2 focus:outline-none",
              search 
                ? "border-blue-400 bg-blue-50/50" 
                : "border-gray-200 bg-white hover:border-gray-300",
              "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            )}
          />
        </div>

        {/* Age Group Filter */}
        <div className="relative">
          <select
            value={ageGroup}
            onChange={(e) => onAgeGroupChange(e.target.value)}
            className={cn(
              "w-full px-4 py-3 rounded-xl transition-all cursor-pointer",
              "border-2 focus:outline-none appearance-none",
              "bg-white hover:border-gray-300",
              ageGroup 
                ? "border-orange-400 bg-orange-50/50 font-semibold" 
                : "border-gray-200",
              "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            )}
          >
            {ageGroups.map((group) => (
              <option key={group.value} value={group.value}>
                {group.emoji} {group.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Topic Filter - Desktop: Dropdown, Mobile: Button */}
        {isMobile ? (
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className={cn(
              "w-full px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between",
              "border-2 focus:outline-none",
              "bg-white hover:border-gray-300",
              selectedTopics.length > 0
                ? "border-purple-400 bg-purple-50/50 font-semibold"
                : "border-gray-200"
            )}
          >
            <span className="flex items-center gap-2">
              <span>🌟</span>
              <span>
                {selectedTopics.length === 0 
                  ? "Lọc theo chủ đề" 
                  : `${selectedTopics.length} chủ đề`}
              </span>
            </span>
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        ) : (
          <TopicFilterDropdown
            selectedTopics={selectedTopics}
            topics={topics}
            onChange={onTopicsChange}
          />
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-blue-100">
          <div className="flex flex-wrap gap-2">
            {search && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                <Search className="w-3 h-3" />
                &quot;{search}&quot;
              </span>
            )}
            {ageGroup && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full">
                👶 {ageGroup}
              </span>
            )}
            {selectedTopics.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
                🌟 {selectedTopics.length} chủ đề
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      <TopicFilterBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        selectedTopics={selectedTopics}
        topics={topics}
        onChange={onTopicsChange}
      />
    </div>
  );
}

