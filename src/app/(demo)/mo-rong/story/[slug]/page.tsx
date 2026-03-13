"use client";
import { useParams } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import StoryDetail from "@/components/expansion/story-detail";
import { storyBooks } from "@/mock/storybooks";

export default function StoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const story = storyBooks.find((s) => s.slug === slug);

  if (!story) {
    return (
      <ContentLayout title="Story book">
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-[20px] text-[#999]">Không tìm thấy truyện</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Story book">
      <StoryDetail story={story} />
    </ContentLayout>
  );
}
