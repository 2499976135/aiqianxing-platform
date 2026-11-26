import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import NoDownloadMedia from "@/components/common/NoDownloadMedia";
import { usePlatformStore } from "@/store/platformStore";
import { Image, Video, Shield } from "lucide-react";

export default function AdminMaterials() {
  const approvedCheckIns = usePlatformStore((s) =>
    s.checkIns.filter((c) => c.status === "approved"),
  );
  const progress = usePlatformStore((s) => s.progress);
  const points = usePlatformStore((s) => s.points);

  // 从审核通过的打卡中提取素材
  const checkInImages = approvedCheckIns.flatMap((c) =>
    c.images.map((src) => ({
      src,
      label: c.teacherName,
      sub: c.schoolName,
      childrenPortrait: true,
    })),
  );
  const checkInVideos = approvedCheckIns.flatMap((c) =>
    c.videos.map((src) => ({
      src,
      label: c.teacherName,
      sub: c.schoolName,
      childrenPortrait: true,
    })),
  );

  // 进展动态中的素材
  const progressImages = progress.flatMap((p) =>
    p.images.map((src) => {
      const point = points.find((pt) => pt.id === p.pointId);
      return {
        src,
        label: p.title,
        sub: point?.name ?? "",
        childrenPortrait: false,
      };
    }),
  );

  const allImages = [...checkInImages, ...progressImages];
  const allVideos = [...checkInVideos];

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">素材中心</h1>
        <p className="text-sm text-slate-500 mt-1">
          集中管理机构上传与老师打卡过审的照片视频
        </p>
      </div>

      <Tabs defaultValue="images">
        <TabsList className="mb-6">
          <TabsTrigger value="images">
            <Image className="h-4 w-4 mr-1" />
            图片素材 ({allImages.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-1" />
            视频素材 ({allVideos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          {allImages.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-slate-400">
                暂无过审素材
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allImages.map((item, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="aspect-square bg-slate-100">
                    <NoDownloadMedia src={item.src} type="image" className="w-full h-full" />
                  </div>
                  <CardContent className="py-2 px-3">
                    <div className="text-xs font-medium truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{item.sub}</div>
                    {item.childrenPortrait && (
                      <Badge variant="warning" className="mt-1 text-[10px]">
                        <Shield className="h-2 w-2 mr-0.5" /> 儿童肖像
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos">
          {allVideos.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-slate-400">
                暂无过审视频素材
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allVideos.map((item, idx) => (
                <Card key={idx}>
                  <div className="aspect-video bg-slate-100">
                    <NoDownloadMedia src={item.src} type="video" className="w-full h-full" />
                  </div>
                  <CardContent className="py-2 px-3">
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
