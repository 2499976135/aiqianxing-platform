import { cn } from "@/lib/utils";

interface RedDotBadgeProps {
  count?: number;
  dot?: boolean;
  className?: string;
}

/** 红点角标：有数字时显示数字，dot 模式只显示红点 */
export default function RedDotBadge({
  count,
  dot,
  className,
}: RedDotBadgeProps) {
  if (!dot && (!count || count <= 0)) return null;

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-1 ring-2 ring-background",
        className,
      )}
    >
      {dot ? null : count && count > 99 ? "99+" : count}
    </span>
  );
}
