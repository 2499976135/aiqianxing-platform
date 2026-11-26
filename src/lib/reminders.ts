import type { CheckIn, ProjectPoint } from "@/types";

/** 默认超期阈值（天）：超过该天数未打卡即视为超期 */
export const DEFAULT_OVERDUE_DAYS = 14;

export interface OverdueItem {
  point: ProjectPoint;
  /** 最近一次通过的打卡日期；从未打卡则为空 */
  lastCheckInDate?: string;
  /** 距今天数（自最近打卡或点位创建起算） */
  daysSince: number;
  /** 紧急程度：超期 2 倍阈值以上为 critical */
  level: "warning" | "critical";
}

function daysBetween(from: string) {
  const t = new Date(from).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.floor((Date.now() - t) / 86400000);
}

/** 计算进行中点位里超期未打卡的清单 */
export function getOverduePoints(
  points: ProjectPoint[],
  checkIns: CheckIn[],
  thresholdDays = DEFAULT_OVERDUE_DAYS,
): OverdueItem[] {
  return points
    .filter((p) => p.status === "in_progress")
    .map((p) => {
      const approved = checkIns
        .filter((c) => c.pointId === p.id && c.status === "approved")
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        );
      const last = approved[0];
      const base = last ? last.submittedAt : p.createdAt;
      const daysSince = daysBetween(base);
      return {
        point: p,
        lastCheckInDate: last?.submittedAt,
        daysSince,
        level:
          daysSince >= thresholdDays * 2
            ? ("critical" as const)
            : ("warning" as const),
      };
    })
    .filter((item) => item.daysSince >= thresholdDays)
    .sort((a, b) => b.daysSince - a.daysSince);
}
