import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { usePlatformStore } from "@/store/platformStore";
import { POINT_TYPE_LABEL, POINT_STATUS_LABEL } from "@/data/seed";

export default function AdminPoints() {
  const points = usePlatformStore((s) => s.points);
  const partners = usePlatformStore((s) => s.partners);
  const addPoint = usePlatformStore((s) => s.addPoint);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = points.filter((p) => {
    if (search && !p.name.includes(search) && !p.region.includes(search))
      return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">点位管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            建档维护长/短期公益点位及上下架状态
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> 新建点位
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建公益点位</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4 pt-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                addPoint({
                  name: form.get("name") as string,
                  type: form.get("type") as any,
                  region: form.get("region") as string,
                  description: form.get("description") as string,
                  longTerm: form.get("term") === "long",
                });
                setDialogOpen(false);
              }}
            >
              <div className="space-y-1.5">
                <Label>点位名称</Label>
                <Input name="name" placeholder="如：黔东南从江县加鸠镇音乐教室" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>点位类型</Label>
                  <Select name="type" defaultValue="music_classroom">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music_classroom">音乐教室</SelectItem>
                      <SelectItem value="basketball_classroom">篮球教室</SelectItem>
                      <SelectItem value="street_light">太阳能路灯</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>周期</Label>
                  <Select name="term" defaultValue="long">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">长期 (3年运维)</SelectItem>
                      <SelectItem value="short">短期 (一次性)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>所在地区</Label>
                <Input name="region" placeholder="如：贵州省·黔东南州·从江县" required />
              </div>
              <div className="space-y-1.5">
                <Label>点位介绍</Label>
                <Textarea name="description" rows={3} placeholder="描述点位背景、内容、覆盖范围等..." required />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button type="submit">创建</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索筛选 */}
      <Card className="mb-4">
        <CardContent className="py-3 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              placeholder="搜索点位名称或地区..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="music_classroom">音乐教室</SelectItem>
              <SelectItem value="basketball_classroom">篮球教室</SelectItem>
              <SelectItem value="street_light">太阳能路灯</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending_claim">待认领</SelectItem>
              <SelectItem value="claim_pending">认领审核中</SelectItem>
              <SelectItem value="in_progress">进行中</SelectItem>
              <SelectItem value="completed">已结项</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 列表 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            共 {filtered.length} 个点位
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((p) => {
              const partner = partners.find((pt) => pt.id === p.partnerId);
              return (
                <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3 hover:bg-secondary/60 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/[0.07] text-primary w-fit">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{p.name}</span>
                      {p.longTerm && (
                        <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded">长期</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {POINT_TYPE_LABEL[p.type]} · {p.region}
                      {partner && <> · 合作方：{partner.name}</>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      p.status === "in_progress" ? "success" :
                      p.status === "pending_claim" ? "info" :
                      p.status === "claim_pending" ? "warning" : "secondary"
                    }>
                      {POINT_STATUS_LABEL[p.status]}
                    </Badge>
                    <Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
