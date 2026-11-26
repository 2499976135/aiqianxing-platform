import { useState } from "react";
import { cn } from "@/lib/utils";

interface NoDownloadMediaProps {
  src: string;
  type: "image" | "video";
  alt?: string;
  className?: string;
  showPlaceholder?: boolean;
}

/** 防下载媒体组件：禁用右键、拖拽保存、长按保存 */
export default function NoDownloadMedia({
  src,
  type,
  alt = "",
  className,
}: NoDownloadMediaProps) {
  const [error, setError] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground text-xs rounded-md",
          className,
        )}
      >
        素材加载中…
      </div>
    );
  }

  return (
    <div
      className={cn("no-download relative overflow-hidden", className)}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
    >
      {type === "image" ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
          onError={() => setError(true)}
        />
      ) : (
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-cover pointer-events-none"
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onError={() => setError(true)}
        />
      )}
      {/* 半透明覆盖层进一步阻止右键后选中 */}
      <div className="absolute inset-0 pointer-events-none select-none" />
    </div>
  );
}
