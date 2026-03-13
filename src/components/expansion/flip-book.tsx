"use client";
import React, { useRef, useCallback, forwardRef } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { StoryBook } from "@/mock/storybooks";
import { cn } from "@/lib/utils";
import HTMLFlipBook from "react-pageflip";

interface FlipBookProps {
  story: StoryBook;
  onBack: () => void;
}

interface PageProps {
  children: React.ReactNode;
  number?: number;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, number }, ref) => {
  return (
    <div ref={ref} className="bg-[#FFFDF5] shadow-md overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
        {children}
      </div>
      {number !== undefined && (
        <div className="absolute bottom-3 left-0 right-0 text-center text-[13px] text-[#999]">
          Trang {number}
        </div>
      )}
    </div>
  );
});
Page.displayName = "Page";

export default function FlipBook({ story, onBack }: FlipBookProps) {
  const flipBookRef = useRef<any>(null);

  const goToPrev = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const goToNext = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-[16px] text-[#999]">
          Mở rộng - Story book - {story.title}
        </span>
      </div>

      {/* Main Content */}
      <div
        className="relative rounded-[30px] overflow-hidden min-h-[600px]"
        style={{
          background: "linear-gradient(180deg, #87CEEB 0%, #90EE90 60%, #228B22 100%)",
        }}
      >
        {/* Nature decorations */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[180px]"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #2d8a2d 100%)",
            borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
          }}
        />
        <div className="absolute bottom-4 left-8 text-4xl">🌸</div>
        <div className="absolute bottom-12 left-24 text-3xl">🌼</div>
        <div className="absolute bottom-4 right-8 text-4xl">🌿</div>
        <div className="absolute bottom-12 right-24 text-3xl">🍃</div>

        {/* Header */}
        <div className="relative z-10 p-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-[50px] h-[50px] bg-[#E8652D] rounded-full flex items-center justify-center hover:bg-[#d45a25] transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-[24px] font-bold text-[#D12828]">{story.title}</h1>
        </div>

        {/* FlipBook */}
        <div className="relative z-10 flex justify-center items-center px-6 pb-20">
          {/* Prev */}
          <button
            onClick={goToPrev}
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-lg bg-white hover:bg-gray-100 cursor-pointer transition-all mr-4 flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-[#D12828]" />
          </button>

          {/* Book */}
          {/* @ts-ignore */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={320}
            height={420}
            size="stretch"
            minWidth={280}
            maxWidth={500}
            minHeight={380}
            maxHeight={600}
            showCover={true}
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            className="shadow-2xl rounded-lg"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {/* Cover */}
            <Page>
              <div className="w-full h-full bg-gradient-to-br from-[#E87D7D] to-[#BD5353] flex flex-col items-center justify-center rounded-lg p-6">
                <div className="w-[200px] h-[220px] rounded-[15px] overflow-hidden shadow-xl mb-6">
                  <Image
                    src={story.cover}
                    alt={story.title}
                    width={200}
                    height={220}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-white text-[22px] font-bold text-center leading-tight">
                  {story.title}
                </h2>
                <p className="text-white/70 text-[14px] mt-2">Lật để đọc →</p>
              </div>
            </Page>

            {/* Story Pages */}
            {story.pages.map((page, idx) => (
              <Page key={idx} number={idx + 1}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
                  <div className="w-full h-[220px] rounded-[12px] overflow-hidden">
                    <Image
                      src={page.image}
                      alt={`Page ${idx + 1}`}
                      width={300}
                      height={220}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[16px] leading-relaxed text-[#333] font-medium text-center flex-1 flex items-center">
                    {page.text}
                  </p>
                </div>
              </Page>
            ))}

            {/* Back Cover */}
            <Page>
              <div className="w-full h-full bg-gradient-to-br from-[#BD5353] to-[#8B3A3A] flex flex-col items-center justify-center rounded-lg p-6">
                <span className="text-5xl mb-4">📖</span>
                <h2 className="text-white text-[20px] font-bold text-center">Hết truyện</h2>
                <p className="text-white/70 text-[14px] mt-2 text-center">
                  Bạn đã đọc xong &quot;{story.title}&quot;
                </p>
              </div>
            </Page>
          </HTMLFlipBook>

          {/* Next */}
          <button
            onClick={goToNext}
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-lg bg-white hover:bg-gray-100 cursor-pointer transition-all ml-4 flex-shrink-0"
          >
            <ChevronRight className="w-6 h-6 text-[#D12828]" />
          </button>
        </div>
      </div>
    </div>
  );
}
