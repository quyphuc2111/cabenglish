import Image from "next/image";
import React from "react";

/**
 * Interface định nghĩa các props cho OptimizeImage component
 * @interface ImageProps
 */
interface ImageProps {
  /** Đường dẫn của hình ảnh (URL hoặc đường dẫn local) */
  src: string;

  /** Chiều rộng của hình ảnh (đơn vị pixel) */
  width: number;

  /** Chiều cao của hình ảnh (đơn vị pixel) */
  height: number;

  /** Text mô tả thay thế cho hình ảnh (quan trọng cho SEO và accessibility) */
  alt: string;

  /** Class CSS tùy chỉnh cho container */
  className?: string;

  /** 
   * Định nghĩa kích thước responsive cho hình ảnh
   * @default "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
   */
  sizes?: string;

  /**
   * Chất lượng của hình ảnh (1-100)
   * @default 85
   */
  quality?: number;

  /**
   * Đánh dấu hình ảnh có độ ưu tiên cao khi tải
   * @default false
   */
  priority?: boolean;

  /**
   * Cho phép hình ảnh lấp đầy container cha
   * @default false
   */
  fill?: boolean;

  /**
   * Kiểm soát cách tải hình ảnh
   * @default Dựa vào priority (eager nếu priority=true, lazy nếu priority=false)
   */
  loading?: "lazy" | "eager";

  /**
   * Hiệu ứng placeholder khi hình ảnh đang tải
   * - blur: Hiển thị phiên bản mờ
   * - empty: Không hiển thị gì
   */
  placeholder?: "blur" | "empty";

  /**
   * URL của hình ảnh blur placeholder (thường là base64)
   * Chỉ sử dụng khi placeholder="blur"
   */
  blurDataURL?: string;

  /** Style CSS inline cho container */
  style?: React.CSSProperties;

  /**
   * Cho phép tải hình ảnh không tối ưu
   * @default false
   */
  unoptimized?: boolean;
}

/**
 * Component tối ưu hiển thị hình ảnh sử dụng Next.js Image
 * @component
 * @param {ImageProps} props - Props cho component
 * @returns {JSX.Element} OptimizeImage component
 * @example
 * // Sử dụng cơ bản
 * <OptimizeImage
 *   src="/images/example.jpg"
 *   width={800}
 *   height={600}
 *   alt="Example image"
 * />
 * 
 * // Sử dụng với blur placeholder
 * <OptimizeImage
 *   src="/images/example.jpg"
 *   width={800}
 *   height={600}
 *   alt="Example image"
 *   placeholder="blur"
 *   blurDataURL="data:image/jpeg;base64,..."
 * />
 */
function OptimizeImage({
  src,
  width,
  height,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  priority = false,
  fill = false,
  loading,
  placeholder,
  blurDataURL,
  style,
  ...props
}: ImageProps) {
  return (
    <div className={`relative ${className || ''}`} style={{ ...style }}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes={sizes}
        quality={quality}
        priority={priority}
        fill={fill}
        loading={loading || (priority ? 'eager' : 'lazy')}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className="object-cover"
        {...props}
      />
    </div>
  );
}

export default OptimizeImage;
