import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "@/components/common/EmptyState";
import { usePlatformStore } from "@/store/platformStore";
import { POINT_TYPE_LABEL, PARTNER_TYPE_LABEL } from "@/data/seed";
import { MapPin, Filter, Lock, Loader2 } from "lucide-react";

/** ③ 待冠名点位认领目录 — 公开筛选 · 实时锁点 */
export default function ClaimDirectory() {
  const points = usePlatformStore((s) => s.points);
  const submitClaim = usePlatformStore((s) => s.submitClaim);

  const [typeFilter, setTypeFilter] = useState("all");
  const [regionSearch, setRegionSearch] = useState("");
  const [claimingPoint, setClaimingPoint] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ pointName: string } | null>(null);

  const pendingPoints = points.filter((p) => {
    if (p.status !== "pending_claim" && p.status !== "claim_pending") return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (
      regionSearch &&
      !p.region.includes(regionSearch) &&
      !p.name.includes(regionSearch)
    )
      return false;
    return true;
  });

  const handleSubmitClaim = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!claimingPoint) return;
    setSubmitting(true);
    // 模拟短暂延迟后提交
    await new Promise((r) => setTimeout(r, 500));
    const form = new FormData(e.currentTarget);
    submitClaim(claimingPoint, {
      partnerName: form.get("partnerName") as string,
      partnerType: form.get("partnerType") as any,
      contactPerson: form.get("contactPerson") as string,
      contactPhone: form.get("contactPhone") as string,
      contactEmail: (form.get("contactEmail") as string) || undefined,
      message: (form.get("message") as string) || undefined,
    });
    const point = points.find((p) => p.id === claimingPoint);
    setSuccessInfo({ pointName: point?.name ?? "" });
    setSubmitting(false);
  };

  // 认领中状态的点位显示锁点提示
  const lockedPoint = claimingPoint
    ? points.find((p) => p.id === claimingPoint && p.status === "claim_pending")
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium mb-3">
            公开目录 · 自助冠名
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            为爱黔行 · 待冠名公益点位
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            浏览全部待冠名的公益点位，在线提交意向认领。
            认领成功后点位将自动锁定，由机构人工确权后正式绑定。
          </p>
        </div>

        {/* 筛选 */}
        <Card className="mb-6">
          <CardContent className="py-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder="搜索地区或点位名称..."
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground/70" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="music_classroom">音乐教室</SelectItem>
                  <SelectItem value="basketball_classroom">篮球教室</SelectItem>
                  <SelectItem value="street_light">太阳能路灯</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 点位卡片网格 */}
        {pendingPoints.length === 0 ? (
          <EmptyState
            title="暂无可认领点位"
            description="所有点位已被认领，欢迎持续关注"
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {pendingPoints.map((p) => {
              const isLocked = p.status === "claim_pending";
              return (
                <Card
                  key={p.id}
                  className={isLocked ? "border-warning/30 bg-warning/[0.04]" : ""}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant={
                          p.type === "street_light" ? "warning" : "info"
                        }
                      >
                        {POINT_TYPE_LABEL[p.type]}
                      </Badge>
                      {p.longTerm ? (
                        <Badge variant="secondary">3年运维</Badge>
                      ) : (
                        <Badge variant="outline">一次性</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{p.name}</h3>
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {p.region}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {isLocked ? (
                        <Badge variant="warning">
                          <Lock className="h-3 w-3 mr-1" /> 认领审核中
                        </Badge>
                      ) : (
                        <Badge variant="success">✨ 可认领</Badge>
                      )}
                      <Button
                        size="sm"
                        variant={isLocked ? "outline" : "default"}
                        disabled={isLocked}
                        onClick={() => setClaimingPoint(p.id)}
                      >
                        {isLocked ? "已被锁定" : "提交认领意向"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 认领 Dialog */}
      <Dialog
        open={!!claimingPoint && !successInfo}
        onOpenChange={(o) => !o && setClaimingPoint(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>提交认领意向</DialogTitle>
          </DialogHeader>

          {lockedPoint ? (
            <div className="py-4 text-center">
              <Lock className="h-12 w-12 text-warning mx-auto mb-3" />
              <div className="font-medium text-warning mb-2">
                该点位已被他人锁定
              </div>
              <p className="text-sm text-muted-foreground">
                该点位认领审核中，若审核驳回将自动解锁。
                <br />请选择其他点位或稍后再来。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitClaim} className="space-y-3">
              <div className="space-y-1.5">
                <Label>合作方名称 *</Label>
                <Input name="partnerName" required placeholder="企业/机构名称" />
              </div>
              <div className="space-y-1.5">
                <Label>主体类型 *</Label>
                <Select name="partnerType" required defaultValue="enterprise">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise">
                      {PARTNER_TYPE_LABEL.enterprise}
                    </SelectItem>
                    <SelectItem value="creator">
                      {PARTNER_TYPE_LABEL.creator}
                    </SelectItem>
                    <SelectItem value="artist">
                      {PARTNER_TYPE_LABEL.artist}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>联系人 *</Label>
                <Input name="contactPerson" required />
              </div>
              <div className="space-y-1.5">
                <Label>手机号 *</Label>
                <Input name="contactPhone" required placeholder="用于认领通知" />
              </div>
              <div className="space-y-1.5">
                <Label>邮箱（可选）</Label>
                <Input name="contactEmail" type="email" />
              </div>
              <div className="space-y-1.5">
                <Label>留言（可选）</Label>
                <Textarea
                  name="message"
                  rows={2}
                  placeholder="给公益机构的一句话留言"
                />
              </div>
              <div className="text-xs text-warning bg-warning/[0.07] rounded p-2">
                ⚠️ 提交后该点位将自动锁定，其他人无法再认领。
                机构人工审核通过后正式绑定冠名权益。
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setClaimingPoint(null)}
                >
                  取消
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" /> 提交中
                    </>
                  ) : (
                    "提交认领意向"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 成功提示 */}
      {successInfo && (
        <Dialog open>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>🎉 提交成功！</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-center">
              <Lock className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                您已成功提交对「<b>{successInfo.pointName}</b>」的认领意向。
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                该点位现已为您锁定，机构将在 3 个工作日内完成人工审核并通过您填写的联系方式与您沟通。
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setClaimingPoint(null);
                  setSuccessInfo(null);
                }}
              >
                好的，我知道了
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
