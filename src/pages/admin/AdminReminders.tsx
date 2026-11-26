import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { usePlatformStore } from "@/store/platformStore";
import {
  getOverduePoints,
  DEFAULT_OVERDUE_DAYS,
} from "@/lib/reminders";
import {
  BellRing,
  CheckCircle2,
  MapPin,
  School,
  Send,
  CalendarClock,
} from "lucide-react";

const THRESHOLDS = [7, 14, 30];

/** 超期未打卡提醒：定时检测进行中点位，人工一键提醒并留痕 */
export default function AdminReminders() {
  const points = usePlatformStore((s) => s.points);
  const checkIns = usePlatformStore((s) => s.checkIns);
  const auditLogs = usePlatformStore((s) => s.auditLogs);
  const sendOverdueReminder = usePlatformStore((s) => s.sendOverdueReminder);

  const [threshold, setThreshold] = useState(DEFAULT_OVERDUE_DAYS);
  const overdue = useMemo(
    () => getOverduePoints(points, checkIns, threshold),
    [points, checkIns, threshold],
  );

  const reminderCount = (pointId: string) =>
    auditLogs.filter(
      (l) => l.action === "发送超期未打卡提醒" && l.targetId === pointId,
    ).length;

  const lastReminder = (pointId: string) =>
    auditLogs
      .filter(
        (l) => l.action === "发送超期未打卡提醒" && l.targetId === pointId,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">跟进提醒</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            系统按阈值检测进行中点位，超过{" "}
            <span className="tnum font-medium text-foreground">
              {threshold}
            </span>{" "}
            天未打卡即列入清单，提醒操作会写入留痕。
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {THRESHOLDS.map((d) => (
            <button
              key={d}
              onClick={() => setThreshold(d)}
              className={
                "rounded-md border px-2.5 py-1 text-xs transition-colors " +
                (threshold === d
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary")
              }
            >
              {d} 天
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        <div className="bg-card px-5 py-4">
          <div className="tnum text-2xl font-semibold text-warning">
            {overdue.length}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">超期点位</div>
        </div>
        <div className="bg-card px-5 py-4">
          <div className="tnum text-2xl font-semibold">
            {overdue.filter((o) => o.level === "critical").length}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">严重超期</div>
        </div>
        <div className="col-span-2 bg-card px-5 py-4 sm:col-span-1">
          <div className="tnum text-2xl font-semibold">
            {points.filter((p) => p.status === "in_progress").length}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">进行中点位</div>
        </div>
      </div>

      {overdue.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium">所有点位都按时打卡</div>
            <p className="mt-1 text-xs text-muted-foreground">
              近 {threshold} 天内没有需要跟进的学校
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {overdue.map((item) => {
            const p = item.point;
            const count = reminderCount(p.id);
            const last = lastReminder(p.id);
            return (
              <Card
                key={p.id}
                className={
                  "border-l-4 " +
                  (item.level === "critical"
                    ? "border-l-destructive"
                    : "border-l-warning")
                }
              >
                <CardContent className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{p.name}</h3>
                        <Badge
                          variant={
                            item.level === "critical" ? "destructive" : "warning"
                          }
                        >
                          {item.level === "critical" ? "严重超期" : "待跟进"}
                        </Badge>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <School className="h-3 w-3" />
                          {p.schoolName ?? "未关联学校"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {p.region}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock className="h-3 w-3" />
                          {item.lastCheckInDate
                            ? `最近打卡 ${item.lastCheckInDate}`
                            : `自 ${p.createdAt} 起从未打卡`}
                        </span>
                      </div>
                      {count > 0 && last && (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          已提醒 {count} 次 · 最近一次{" "}
                          {last.createdAt.slice(0, 16).replace("T", " ")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div
                          className={
                            "tnum text-2xl font-semibold leading-none " +
                            (item.level === "critical"
                              ? "text-destructive"
                              : "text-warning")
                          }
                        >
                          {item.daysSince}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          天未打卡
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={item.level === "critical" ? "default" : "outline"}
                        onClick={() =>
                          sendOverdueReminder(
                            p.id,
                            `已向 ${p.schoolName ?? p.name} 负责老师发送打卡提醒（超期 ${item.daysSince} 天）`,
                          )
                        }
                      >
                        <Send className="mr-1.5 h-3.5 w-3.5" />
                        发送提醒
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 rounded-lg border border-dashed border-border bg-card/50 px-4 py-3">
        <BellRing className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          演示环境：提醒不会真正发送短信或微信，仅在操作留痕中记录。正式接入后可按点位配置时限定时触发，并同步至飞书任务。
        </p>
      </div>
    </div>
  );
}
