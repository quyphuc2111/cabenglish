"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { StoryBook } from "@/mock/storybooks";
import FlipBook from "./flip-book";

interface StoryDetailProps {
  story: StoryBook;
}

export default function StoryDetail({ story }: StoryDetailProps) {
  const router = useRouter();
  const [showFlipBook, setShowFlipBook] = useState(false);

  if (showFlipBook) {
    return <FlipBook story={story} onBack={() => setShowFlipBook(false)} />;
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-[16px] text-[#999]">Mở rộng - Story book</span>
      </div>

      {/* Main Content with nature background */}
      <div
        className="relative rounded-[30px] overflow-hidden min-h-[500px]"
        style={{
          background: "linear-gradient(180deg, #87CEEB 0%, #90EE90 60%, #228B22 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px]"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #2d8a2d 100%)",
            borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
          }}
        />

        {/* Flowers and leaves decorations */}
        <div className="absolute bottom-4 left-8 text-4xl">🌸</div>
        <div className="absolute bottom-12 left-24 text-3xl">🌼</div>
        <div className="absolute bottom-4 right-8 text-4xl">🌿</div>
        <div className="absolute bottom-12 right-24 text-3xl">🍃</div>
        <div className="absolute bottom-20 left-4 text-2xl">🌱</div>
        <div className="absolute bottom-20 right-4 text-2xl">🌻</div>

        {/* Back button */}
        <div className="relative z-10 p-6">
          <button
            onClick={() => router.push("/mo-rong")}
            className="w-[50px] h-[50px] bg-[#E8652D] rounded-full flex items-center justify-center hover:bg-[#d45a25] transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-center text-[28px] font-bold text-[#D12828] relative z-10 -mt-4 mb-6">
          {story.title}
        </h1>

        {/* Content Card */}
        <div className="relative z-10 mx-auto max-w-[750px] bg-white/90 backdrop-blur-sm rounded-[25px] p-8 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="w-[260px] h-[280px] rounded-[15px] overflow-hidden shadow-lg">
                <Image
                  src={story.cover}
                  alt={story.title}
                  width={260}
                  height={280}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Vocabulary & Actions */}
            <div className="flex-1 space-y-6">
              {/* Vocabulary */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🏅</span>
                  <h2 className="text-[20px] font-bold text-[#E8652D]">
                    Vocabulary - ({story.vocabulary.length} words):
                  </h2>
                </div>

                <div className="space-y-3 ml-4">
                  {story.vocabulary.map((vocab, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <button className="text-lg">🔊</button>
                      <span className="text-[18px] font-semibold text-[#333] min-w-[80px]">
                        {vocab.word}
                      </span>
                      <span className="text-[18px] text-[#666]">
                        {vocab.phonetic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Detail Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="bg-[#F5E6E6] text-[#BD5353] border-none rounded-full px-8 py-2 hover:bg-[#f0d8d8] font-medium text-[16px]"
                >
                  Xem chi tiết
                </Button>
              </div>

              {/* Listen to Flip Story */}
              <button
                onClick={() => setShowFlipBook(true)}
                className="flex items-center gap-3 group"
              >
                <div className="w-[50px] h-[50px] bg-[#E8652D] rounded-full flex items-center justify-center shadow-md group-hover:bg-[#d45a25] transition-colors">
                  <span className="text-white text-xl">🎧</span>
                </div>
                <span className="text-[20px] font-bold text-[#1D5995] group-hover:underline">
                  Nghe truyện lật
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
