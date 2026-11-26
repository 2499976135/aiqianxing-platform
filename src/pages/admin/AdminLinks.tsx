import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlatformStore } from "@/store/platformStore";
import { POINT_STATUS_LABEL } from "@/data/seed";
import { Link2, RefreshCw, Ban, Copy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLinks() {
  const points = usePlatformStore((s) => s.points);
  const partners = usePlatformStore((s) => s.partners);
  const regenerate = usePlatformStore((s) => s.regenerateAccessToken);
  const revoke = usePlatformStore((s) => s.revokeAccessToken);

  const pointsWithLinks = points.filter(
    (p) => p.partnerId || p.accessToken,
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => alert("链接已复制到剪贴板"),
      () => alert("复制失败，请手动选择复制"),
    );
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">专属链接管理</h1>
        <p className="text-sm text-slate-500 mt-1">
          为每位合作方生成不可预测的专属链接，支持一键失效与重置
        </p>
      </div>

      <div className="space-y-4">
        {pointsWithLinks.map((p) => {
          const partner = partners.find((pt) => pt.id === p.partnerId);
          const url = p.accessToken
            ? `${window.location.origin}/p/${p.accessToken}`
            : "";
          return (
            <Card key={p.id}>
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      合作方：{partner?.name ?? "未绑定"} · {POINT_STATUS_LABEL[p.status]}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!p.accessToken ? (
                      <Badge variant="outline">未生成链接</Badge>
                    ) : p.tokenRevoked ? (
                      <Badge variant="destructive">已失效</Badge>
                    ) : (
                      <Badge variant="success">
                        <Link2 className="h-3 w-3 mr-1" /> 有效
                      </Badge>
                    )}
                  </div>
                </div>

                {url && (
                  <div className="mt-3 bg-slate-50 rounded-md px-3 py-2 flex items-center gap-2">
                    <code className="text-xs text-slate-700 flex-1 truncate">
                      {url}
                    </code>
                    {!p.tokenRevoked && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(url)}
                          title="复制链接"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          asChild
                          title="预览"
                        >
                          <Link to={`/p/${p.accessToken}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => regenerate(p.id)}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {p.accessToken ? "重置链接" : "生成链接"}
                  </Button>
                  {p.accessToken && !p.tokenRevoked && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("确认失效该专属链接？旧凭证将立即作废。"))
                          revoke(p.id);
                      }}
                    >
                      <Ban className="h-3 w-3 mr-1" /> 失效链接
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {pointsWithLinks.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">暂无已认领点位</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-500">
              点位经认领审核通过后，系统会自动为合作方生成专属访问链接。
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
