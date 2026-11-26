import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlatformStore } from "@/store/platformStore";
import { POINT_TYPE_LABEL, POINT_STATUS_LABEL } from "@/data/seed";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, MapPin, ClipboardCheck, FileText } from "lucide-react";

export default function AdminDashboard() {
  const points = usePlatformStore((s) => s.points);
  const partners = usePlatformStore((s) => s.partners);
  const progress = usePlatformStore((s) => s.progress);
  const pendingClaims = usePlatformStore((s) => s.claims.filter((c) => c.status === "pending").length);
  const pendingCheckIns = usePlatformStore((s) => s.checkIns.filter((c) => c.status === "pending").length);

  const stats = [
    { label: "总点位", value: points.length, icon: MapPin, color: "text-primary" },
    { label: "进行中", value: points.filter((p) => p.status === "in_progress").length, icon: FileText, color: "text-success" },
    { label: "合作方", value: partners.length, icon: ClipboardCheck, color: "text-accent" },
    { label: "审核待办", value: pendingClaims + pendingCheckIns, icon: ClipboardCheck, color: "text-warning" },
  ];

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">工作台</h1>
        <p className="text-sm text-muted-foreground mt-1">
          一处维护、全局把关 — 这里汇总了平台核心运营数据
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                  <div className="text-2xl font-bold mt-1">{s.value}</div>
                </div>
                <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 审核提醒 */}
      {(pendingClaims > 0 || pendingCheckIns > 0) && (
        <Card className="mb-8 border-warning/25 bg-warning/[0.05]">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-medium text-foreground">待办审核提醒</div>
                <div className="text-sm text-warning">
                  {pendingClaims} 条认领申请 · {pendingCheckIns} 条老师打卡 等待处理
                </div>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/reviews">
                前往审核 <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 点位列表预览 */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">点位概览</CardTitle>
            <Button asChild size="sm" variant="ghost">
              <Link to="/admin/points">
                全部 <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {points.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{POINT_TYPE_LABEL[p.type]} · {p.region}</div>
                </div>
                <Badge variant={
                  p.status === "in_progress" ? "success" :
                  p.status === "pending_claim" ? "info" :
                  p.status === "claim_pending" ? "warning" : "secondary"
                }>
                  {POINT_STATUS_LABEL[p.status]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 最新进展动态 */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">最新进展</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-3 w-3 mr-1" /> 发布进展
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {progress.slice(0, 4).map((p) => (
              <div key={p.id} className="text-sm">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {p.publishedAt} · {p.images.length} 张图片
                </div>
              </div>
            ))}
            {progress.length === 0 && (
              <div className="text-sm text-muted-foreground/70 text-center py-4">
                暂无进展动态
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
