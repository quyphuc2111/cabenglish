import { SectionContentType } from "@/types/section";

interface ContentViewerProps {
  content: SectionContentType;
  onLoad: () => void;
  onError: () => void;
}

export const ContentViewer = ({ content, onLoad, onError }: ContentViewerProps) => {
  return (
    <div className="relative flex-shrink-0">
      {content.iframe_url.startsWith("http") ? (
        <iframe
          src={content.iframe_url}
          className="w-full h-[350px] 3xl:h-[450px]"
          title={content.title}
          onLoad={onLoad}
          onError={onError}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-[350px] 3xl:h-[450px] flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Đường dẫn bài học không hợp lệ</p>
        </div>
      )}
    </div>
  );
}; 