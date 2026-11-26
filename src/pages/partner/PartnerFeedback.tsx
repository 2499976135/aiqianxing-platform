import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NoDownloadMedia from "@/components/common/NoDownloadMedia";
import EmptyState from "@/components/common/EmptyState";
import { usePlatformStore } from "@/store/platformStore";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { POINT_TYPE_LABEL } from "@/data/seed";

/** 长期点位按创建时间推算运维进度（3 年周期） */
function longTermProgress(createdAt: string) {
  const start = new Date(createdAt).getTime();
  const years = Number.isNaN(start)
    ? 0
    : (Date.now() - start) / (365.25 * 24 * 3600 * 1000);
  const year = Math.min(3, Math.max(1, Math.floor(years) + 1));
  const percent = Math.min(100, Math.max(6, Math.round((years / 3) * 100)));
  return { year, percent };
}

/** ② 合作方专属进展反馈页 — 免登录私密访问，进展优先 */
export default function PartnerFeedback() {
  const { token } = useParams<{ token: string }>();
  const getPartnerByToken = usePlatformStore((s) => s.getPartnerByToken);
  const progress = usePlatformStore((s) => s.progress);
  const points = usePlatformStore((s) => s.points);
  const [activePoint, setActivePoint] = useState<string>("all");

  const result = token ? getPartnerByToken(token) : null;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-bg px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-dashed border-destructive/40 bg-destructive/[0.06]">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-xl font-bold mb-2">链接已失效</h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            该专属链接已由机构重置，或凭证不正确，无法继续查看。
            <br />
            为保护合作方隐私，此页面不显示点位是否存在。
          </p>
          <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-left">
            <div className="text-xs text-muted-foreground">
              请联系机构对接人获取新链接
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground">
              <Mail className="h-3.5 w-3.5 text-primary" />
              cooperation@weiaiqianxing.org
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> 返回首页
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { partner } = result;
  const myPoints = points.filter((p) => partner.points.includes(p.id));
  const myProgress = progress
    .filter((pr) => partner.points.includes(pr.pointId) && pr.published)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  const visible =
    activePoint === "all"
      ? myProgress
      : myProgress.filter((pr) => pr.pointId === activePoint);
  const latest = myProgress[0]?.publishedAt;

  return (
    <div className="min-h-screen paper-bg">
      <div className="mx-auto max-w-4xl px-4 py-5 md:py-7">
        {/* 紧凑页头：一眼知道是谁的项目 */}
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
              {partner.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold leading-tight">
                {partner.name}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  项目进展
                </span>
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                为爱黔行公益 · 共 {myPoints.length} 个点位 · {myProgress.length}{" "}
                条进展
                {latest ? ` · 最近更新 ${latest}` : ""}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 text-[11px]">
            免登录 · 专属链接
          </Badge>
        </header>

        {/* 点位筛选 */}
        {myPoints.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {[{ id: "all", name: "全部点位" }, ...myPoints].map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePoint(p.id)}
                className={
                  "rounded-full border px-3 py-1 text-xs transition-colors " +
                  (activePoint === p.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary")
                }
              >
                {"name" in p ? p.name : ""}
              </button>
            ))}
          </div>
        )}

        {/* 项目概览：紧凑三列 */}
        <div className="mb-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {myPoints.map((p) => {
            const updates = myProgress.filter(
              (pr) => pr.pointId === p.id,
            ).length;
            const prog = p.longTerm ? longTermProgress(p.createdAt) : null;
            return (
              <div
                key={p.id}
                className={`rounded-lg border border-border border-l-4 bg-card p-3 ${
                  p.longTerm ? "border-l-primary" : "border-l-success"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {POINT_TYPE_LABEL[p.type] ?? "公益点位"} ·{" "}
                    {p.longTerm ? "长期" : "短期"}
                  </span>
                  <Badge
                    variant={
                      p.status === "completed"
                        ? "secondary"
                        : p.status === "in_progress"
                          ? "success"
                          : "warning"
                    }
                  >
                    {p.status === "completed"
                      ? "已结项"
                      : p.status === "in_progress"
                        ? "进行中"
                        : "待启动"}
                  </Badge>
                </div>
                <h3 className="mt-1.5 text-[13px] font-semibold leading-snug">
                  {p.name}
                </h3>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="h-2.5 w-2.5" />
                  {p.region}
                </div>
                {prog ? (
                  <>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${prog.percent}%` }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>
                        第 {prog.year} 年 / 共 3 年
                      </span>
                      <span>进展 {updates} 条</span>
                    </div>
                  </>
                ) : (
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>
                      {p.completedAt ? `${p.completedAt} 已验收` : "一次性落地"}
                    </span>
                    <span>进展 {updates} 条</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 进展时间线：页面主体 */}
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">进展时间线</h2>
          <span className="text-xs text-muted-foreground">
            {visible.length} 条
          </span>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-6 w-6" />}
            title="暂无动态"
            description="机构正在整理项目进展，将陆续在此更新"
          />
        ) : (
          <div className="relative pl-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-border">
            {visible.map((pr, idx) => (
              <div key={pr.id} className="relative mb-4 last:mb-0">
                <div className="absolute -left-[20px] top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="tnum text-[11px] text-muted-foreground">
                      {pr.publishedAt}
                    </span>
                    {idx === 0 && activePoint === "all" && (
                      <Badge variant="info">最新进展</Badge>
                    )}
                  </div>
                  <h3 className="text-[15px] font-semibold leading-snug">
                    {pr.title}
                  </h3>
                  <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-foreground/85">
                    {pr.content}
                  </p>
                  {pr.images.length > 0 && (
                    <div
                      className={`mt-3 grid gap-2 ${
                        pr.images.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-2 md:grid-cols-3"
                      }`}
                    >
                      {pr.images.map((img, i) => (
                        <div
                          key={i}
                          className="aspect-video overflow-hidden rounded-md bg-muted"
                        >
                          <NoDownloadMedia
                            src={img}
                            type="image"
                            className="h-full w-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {pr.videos.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                      {pr.videos.map((v, i) => (
                        <div
                          key={i}
                          className="aspect-video overflow-hidden rounded-md bg-muted"
                        >
                          <NoDownloadMedia
                            src={v}
                            type="video"
                            className="h-full w-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 底部：一行合规说明 */}
        <footer className="mt-8 border-t border-border pt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
          本页素材仅支持在线预览，下载入口已关闭 · 贵州省为爱黔行公益服务中心
        </footer>
      </div>
    </div>
  );
}
