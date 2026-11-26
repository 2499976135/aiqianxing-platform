import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlatformStore } from "@/store/platformStore";
import { PARTNER_TYPE_LABEL } from "@/data/seed";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function AdminReviews() {
  const claims = usePlatformStore((s) => s.claims);
  const checkIns = usePlatformStore((s) => s.checkIns);
  const points = usePlatformStore((s) => s.points);
  const reviewClaim = usePlatformStore((s) => s.reviewClaim);
  const reviewCheckIn = usePlatformStore((s) => s.reviewCheckIn);

  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});

  const renderClaimCard = (c: typeof claims[0]) => {
    const point = points.find((p) => p.id === c.pointId);
    return (
      <Card key={c.id} className="mb-3">
        <CardContent className="py-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-medium">{c.partnerName}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {PARTNER_TYPE_LABEL[c.partnerType]} · {c.contactPerson} · {c.contactPhone}
              </div>
              {point && (
                <div className="text-xs text-slate-600 mt-2 bg-slate-50 rounded px-2 py-1 inline-block">
                  申请认领：{point.name}
                </div>
              )}
              {c.message && (
                <p className="text-sm text-slate-600 mt-2 italic">"{c.message}"</p>
              )}
            </div>
            <Badge variant={
              c.status === "pending" ? "warning" :
              c.status === "approved" ? "success" : "destructive"
            }>
              {c.status === "pending" ? "待审核" : c.status === "approved" ? "已通过" : "已驳回"}
            </Badge>
          </div>

          {c.status === "pending" ? (
            <div className="space-y-2 pt-2 border-t">
              <Textarea
                placeholder="驳回原因（驳回时必填）"
                value={rejectNote[c.id] ?? ""}
                onChange={(e) =>
                  setRejectNote({ ...rejectNote, [c.id]: e.target.value })
                }
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const note = rejectNote[c.id];
                    if (!note.trim()) {
                      alert("驳回时请填写原因");
                      return;
                    }
                    reviewClaim(c.id, false, note);
                  }}
                >
                  <XCircle className="h-3 w-3 mr-1" /> 驳回
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (
                      !confirm(
                        `确认通过 ${c.partnerName} 的认领申请？\n将绑定为合作方并生成专属访问链接。`,
                      )
                    )
                      return;
                    reviewClaim(c.id, true);
                  }}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> 通过（二次确认）
                </Button>
              </div>
            </div>
          ) : (
            c.reviewNote && (
              <div className="text-xs text-slate-500 pt-2 border-t">
                审核备注：{c.reviewNote}
              </div>
            )
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCheckInCard = (ci: typeof checkIns[0]) => {
    return (
      <Card key={ci.id} className="mb-3">
        <CardContent className="py-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-medium">
                {ci.teacherName} · {ci.schoolName}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {ci.submittedAt} · 提交了 {ci.images.length} 张图 {ci.videos.length} 个视频
              </div>
              <div className="text-sm mt-2 font-medium">{ci.courseName}</div>
              <p className="text-sm text-slate-600 mt-1">{ci.content}</p>
            </div>
            <Badge variant={
              ci.status === "pending" ? "warning" :
              ci.status === "approved" ? "success" : "destructive"
            }>
              {ci.status === "pending" ? "待审核" : ci.status === "approved" ? "已通过" : "已驳回"}
            </Badge>
          </div>

          {ci.status === "pending" && (
            <div className="space-y-2 pt-2 border-t">
              <Textarea
                placeholder="驳回原因（驳回时必填）"
                value={rejectNote[ci.id] ?? ""}
                onChange={(e) =>
                  setRejectNote({ ...rejectNote, [ci.id]: e.target.value })
                }
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const note = rejectNote[ci.id];
                    if (!note.trim()) {
                      alert("驳回时请填写原因");
                      return;
                    }
                    reviewCheckIn(ci.id, false, note);
                  }}
                >
                  <XCircle className="h-3 w-3 mr-1" /> 驳回
                </Button>
                <Button size="sm" onClick={() => reviewCheckIn(ci.id, true)}>
                  <CheckCircle2 className="h-3 w-3 mr-1" /> 通过
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">审核队列</h1>
        <p className="text-sm text-slate-500 mt-1">
          认领与打卡双队列审核工作台，左侧导航红点提示待审数量
        </p>
      </div>

      <Tabs defaultValue="claims">
        <TabsList className="mb-6">
          <TabsTrigger value="claims">
            认领申请 ({claims.filter((c) => c.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="checkins">
            老师打卡 ({checkIns.filter((c) => c.status === "pending").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="claims">
          {claims.filter((c) => c.status === "pending").length === 0 &&
          claims.length > 0 ? (
            <div className="text-center py-8 text-slate-400">
              ✨ 全部认领申请已处理
            </div>
          ) : (
            <>
              {claims.filter((c) => c.status === "pending").map(renderClaimCard)}
              {claims.filter((c) => c.status === "pending").length === 0 && (
                <Card>
                  <CardContent className="py-16 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    暂无待审核认领申请
                  </CardContent>
                </Card>
              )}
              {claims.filter((c) => c.status !== "pending").length > 0 && (
                <div className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-sm text-slate-500">已处理</CardTitle>
                  </CardHeader>
                  {claims.filter((c) => c.status !== "pending").map(renderClaimCard)}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="checkins">
          {checkIns.filter((c) => c.status === "pending").length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-slate-400">
                暂无待审核打卡记录
              </CardContent>
            </Card>
          ) : (
            checkIns.filter((c) => c.status === "pending").map(renderCheckInCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
