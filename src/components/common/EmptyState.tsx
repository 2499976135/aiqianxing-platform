import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** 空状态组件：温情引导，用于暂无动态/暂无记录场景 */
export default function EmptyState({
  icon,
  title = "暂无内容",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
