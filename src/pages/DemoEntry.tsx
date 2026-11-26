import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Eye,
  Search,
  Smartphone,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { usePlatformStore } from "@/store/platformStore";

/** Demo 总览入口页：一键跳转到四大端口 + 可重置数据 */
export default function DemoEntry() {
  const resetToSeed = usePlatformStore((s) => s.resetToSeed);
  const points = usePlatformStore((s) => s.points);
  const claims = usePlatformStore((s) => s.claims);
  const checkIns = usePlatformStore((s) => s.checkIns);

  // 取第一个可用的 token 用于演示合作方页面
  const samplePartner = points.find((p) => p.accessToken && !p.tokenRevoked);
  const sampleSchool = points.find((p) => p.schoolCode);

  const entries = [
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: "① 机构统一管理后台",
      desc: "点位建档、素材管理、双审核工作台、专属链接管理",
      to: "/admin",
      variant: "default" as const,
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "② 合作方专属进展反馈页",
      desc: "免登录专属链接，项目概况 + 进展时间线",
      to: samplePartner ? `/p/${samplePartner.accessToken}` : "#",
      variant: "secondary" as const,
      disabled: !samplePartner,
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "③ 待冠名点位认领目录",
      desc: "公开筛选、在线意向锁定、防撞单",
      to: "/claim",
      variant: "secondary" as const,
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "④ 乡村老师手机打卡端",
      desc: "大字一屏、弱网友好、草稿暂存",
      to: sampleSchool ? `/t/${sampleSchool.schoolCode}` : "#",
      variant: "secondary" as const,
      disabled: !sampleSchool,
      mobile: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Demo 演示版
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            为爱黔行公益项目协作平台
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            围绕「项目点位」的一套核心底座与四大轻量端口，打通合作方透明进展反馈、待冠名点位自助认领、乡村老师极简打卡与机构统一管理。
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "总点位", value: points.length },
            {
              label: "待认领",
              value: points.filter((p) => p.status === "pending_claim").length,
            },
            {
              label: "认领审核中",
              value: claims.filter((c) => c.status === "pending").length,
            },
            {
              label: "待审核打卡",
              value: checkIns.filter((c) => c.status === "pending").length,
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="py-4">
                <div className="text-2xl font-bold text-slate-900">
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 四大端口入口 */}
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          选择端口开始体验
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {entries.map((e) => (
            <Link
              key={e.title}
              to={e.to}
              className={e.disabled ? "opacity-40 pointer-events-none" : ""}
            >
              <Card className="hover:shadow-md hover:border-slate-300 transition-all cursor-pointer h-full">
                <CardHeader className="flex-row items-start gap-3 space-y-0 pb-2">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    {e.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{e.title}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {e.desc}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  {e.mobile && (
                    <div className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Smartphone className="h-3 w-3" /> 手机端适配
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 重置数据按钮 */}
        <div className="text-center">
          <Button variant="outline" onClick={() => resetToSeed()}>
            <RotateCcw className="h-4 w-4" />
            重置 Demo 数据
          </Button>
          <p className="text-xs text-slate-400 mt-2">
            数据持久化在浏览器 localStorage，可随时重置为种子数据
          </p>
        </div>
      </div>
    </div>
  );
}
