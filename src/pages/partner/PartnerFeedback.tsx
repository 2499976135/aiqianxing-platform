import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NoDownloadMedia from "@/components/common/NoDownloadMedia";
import EmptyState from "@/components/common/EmptyState";
import { usePlatformStore } from "@/store/platformStore";
import {
  Calendar,
  MapPin,
  Clock,
  Building2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

/** ② 合作方专属进展反馈页 — 免登录私密访问 */
export default function PartnerFeedback() {
  const { token } = useParams<{ token: string }>();
  const getPartnerByToken = usePlatformStore((s) => s.getPartnerByToken);
  const progress = usePlatformStore((s) => s.progress);
  const points = usePlatformStore((s) => s.points);

  const result = token ? getPartnerByToken(token) : null;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">链接无效或已失效</h1>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            抱歉，您访问的专属链接可能已被重置或超出访问范围。
            <br />请联系公益机构对接人获取最新访问链接。
          </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* 头部信息 */}
        <Card className="bg-gradient-to-r from-sky-100 to-emerald-100 border-0 mb-6">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white shadow-sm">
                <Building2 className="h-8 w-8 text-sky-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-slate-600 mb-1">
                  为爱黔行公益 · 专属进展反馈
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  {partner.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  {myPoints.map((p) => (
                    <Badge
                      key={p.id}
                      variant={
                        p.status === "in_progress"
                          ? "success"
                          : p.status === "completed"
                          ? "secondary"
                          : "info"
                      }
                    >
                      {p.longTerm ? "3年运维" : "一次性"} · {p.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 点位概况 */}
        {myPoints.map((p) => (
          <Card key={p.id} className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium">{p.name}</span>
              </div>
              <div className="text-xs text-slate-500 mb-3">{p.region}</div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> 创建于 {p.createdAt}
                </span>
                {p.longTerm && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 3年运维周期
                  </span>
                )}
                {p.completedAt && (
                  <span className="text-emerald-600">
                    ✅ {p.completedAt} 已结项
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* 进展时间线 */}
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-sky-600" />
          项目进展（按时间倒序）
        </h2>

        {myProgress.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-6 w-6" />}
            title="暂无动态"
            description="机构正在整理项目进展，将陆续在此更新"
          />
        ) : (
          <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {myProgress.map((pr) => (
              <div key={pr.id} className="relative mb-6 last:mb-0">
                <div className="absolute -left-[17px] top-2 w-3 h-3 rounded-full bg-sky-500 ring-2 ring-white" />
                <Card>
                  <CardContent className="py-4">
                    <div className="text-xs text-slate-500 mb-1">
                      {pr.publishedAt}
                    </div>
                    <h3 className="font-semibold mb-2">{pr.title}</h3>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
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
                        {pr.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="aspect-video rounded-md overflow-hidden bg-slate-100"
                          >
                            <NoDownloadMedia
                              src={img}
                              type="image"
                              className="w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {pr.videos.length > 0 && (
                      <div className="mt-3 grid gap-2 grid-cols-1 md:grid-cols-2">
                        {pr.videos.map((v, idx) => (
                          <div
                            key={idx}
                            className="aspect-video rounded-md overflow-hidden bg-slate-100"
                          >
                            <NoDownloadMedia
                              src={v}
                              type="video"
                              className="w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        <div className="text-center text-xs text-slate-400 mt-12 pb-4">
          © 贵州省为爱黔行公益服务中心 · 本页面内容受版权保护
        </div>
      </div>
    </div>
  );
}
