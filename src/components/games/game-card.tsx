"use client";

import { useState } from "react";
import { Heart, Play, Star } from "lucide-react";
import { Game } from "@/types/game";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  userAge?: number;
  onLike?: (gameId: number, isLiked: boolean) => void;
  onClick?: (game: Game) => void;
}

// Floating heart animation
interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export default function GameCard({ game, userAge, onLike, onClick }: GameCardProps) {
  const [isLiked, setIsLiked] = useState(game.isLikedByUser);
  const [likes, setLikes] = useState(game.numLiked);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Check if game is appropriate for user's age
  const isAgeAppropriate = userAge 
    ? game.ageGroups.some(range => {
        const ages = range.match(/\d+/g)?.map(Number);
        if (ages && ages.length >= 1) {
          return userAge >= ages[0] && userAge <= (ages[1] || ages[0] + 1);
        }
        return false;
      })
    : false;

  const topicEmojis: Record<string, string> = {
    Animals: "🐾",
    Numbers: "🔢",
    Colors: "🎨",
    Alphabet: "🔤",
    Shapes: "⭐",
    Memory: "🧠",
    Math: "➕",
    Art: "🎭",
    Reading: "📖",
    Logic: "🧩",
    Music: "🎵",
    Creative: "✨",
    Nature: "🌿",
    Vocabulary: "📚",
    "Problem Solving": "💡",
    Science: "🔬",
    Space: "🚀",
    Concentration: "🎯"
  };

  // Difficulty level colors
  const difficultyColors = {
    easy: "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
    medium: "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
    hard: "bg-gradient-to-br from-red-500 to-pink-500 text-white"
  };

  const difficultyText = {
    easy: "Dễ",
    medium: "Trung bình",
    hard: "Khó"
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create floating heart animation
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const heartId = Date.now() + Math.random();
    
    setFloatingHearts(prev => [...prev, { id: heartId, x, y }]);
    
    // Remove heart after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
    }, 1000);

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1);
    
    if (onLike) {
      onLike(game.gameId, newIsLiked);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(game);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden shadow-course-inset border-2 border-transparent",
        "transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer",
        "hover:border-blue-200"
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 overflow-hidden">
        <Image
          src={game.imageUrl || "/placeholder.png"}
          alt={game.gameNameVi}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="bg-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 shadow-xl">
            <Play className="w-8 h-8 text-blue-600 fill-blue-600" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {game.isPlayedByUser && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              ✓ Đã chơi
            </span>
          )}
          {userAge && isAgeAppropriate && (
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              👶 Phù hợp
            </span>
          )}
        </div>

        {/* Like Button with Floating Hearts */}
        <button
          onClick={handleLikeClick}
          className="absolute top-2 left-2 bg-white hover:bg-white p-2.5 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-110 z-10"
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-400"
            )} 
          />
          {/* Floating Hearts */}
          {floatingHearts.map(heart => (
            <div
              key={heart.id}
              className="absolute pointer-events-none animate-[float_1s_ease-out_forwards]"
              style={{
                left: `${heart.x}px`,
                top: `${heart.y}px`,
              }}
            >
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            </div>
          ))}
        </button>

        {/* Duration Badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
          <span>⏱️</span>
          <span>{game.estimatedDuration} phút</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 line-clamp-2 text-sm leading-tight flex-1 min-h-[2.5rem]">
            {game.gameNameVi}
          </h3>
          <div className={cn(
            "shrink-0 text-[11px] font-bold px-2 py-1 rounded-lg shadow-sm",
            difficultyColors[game.difficultyLevel]
          )}>
            {difficultyText[game.difficultyLevel]}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2rem]">
          {game.description}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {game.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100"
            >
              <span>{topicEmojis[topic] || "📚"}</span>
              <span>{topic}</span>
            </span>
          ))}
          {game.topics.length > 2 && (
            <span className="inline-flex items-center text-xs text-gray-500 font-medium">
              +{game.topics.length - 2}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="font-bold text-gray-800">{likes}</span>
            </div>
          
          </div>
          <div className="text-xs font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-lg border border-gray-300">
            {game.ageGroups[0]}
          </div>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}

// Add floating animation to global CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-50px) scale(1.5);
      opacity: 0;
    }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('game-card-animations')) {
  style.id = 'game-card-animations';
  document.head.appendChild(style);
}

