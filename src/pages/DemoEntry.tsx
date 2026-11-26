import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Eye,
  Search,
  Smartphone,
  RotateCcw,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { usePlatformStore } from "@/store/platformStore";

/** Demo 总览入口页：一键跳转到四大端口 + 可重置数据 */
export default function DemoEntry() {
  const resetToSeed = usePlatformStore((s) => s.resetToSeed);
  const points = usePlatformStore((s) => s.points);
  const claims = usePlatformStore((s) => s.claims);
  const checkIns = usePlatformStore((s) => s.checkIns);

  const samplePartner = points.find((p) => p.accessToken && !p.tokenRevoked);
  const sampleSchool = points.find((p) => p.schoolCode);

  const entries = [
    {
      index: "01",
      icon: LayoutDashboard,
      title: "机构统一管理后台",
      desc: "点位建档、素材托管、进展发布、专属链接与双审核工作台",
      meta: "PC 工作台",
      to: "/admin",
      featured: true,
    },
    {
      index: "02",
      icon: Eye,
      title: "合作方专属进展反馈页",
      desc: "免登录专属链接，项目概况与倒序进展时间线",
      meta: "免登录 · 定向透明",
      to: samplePartner ? `/p/${samplePartner.accessToken}` : "#",
      disabled: !samplePartner,
    },
    {
      index: "03",
      icon: Search,
      title: "待冠名点位认领目录",
      desc: "公开筛选、在线意向锁定，杜绝撞单与重复提交",
      meta: "公开目录",
      to: "/claim",
    },
    {
      index: "04",
      icon: Smartphone,
      title: "乡村老师手机打卡端",
      desc: "学校自动识别、大字一屏表单、弱网草稿暂存",
      meta: "手机端",
      to: sampleSchool ? `/t/${sampleSchool.schoolCode}` : "#",
      disabled: !sampleSchool,
    },
  ];

  const stats = [
    { label: "公益点位", value: points.length },
    {
      label: "待认领",
      value: points.filter((p) => p.status === "pending_claim").length,
    },
    {
      label: "认领待审",
      value: claims.filter((c) => c.status === "pending").length,
    },
    {
      label: "打卡待审",
      value: checkIns.filter((c) => c.status === "pending").length,
    },
  ];

  return (
    <div className="paper-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-14 sm:px-8">
        {/* 品牌 */}
        <header className="mb-14 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-soft">
              <span className="text-sm font-bold tracking-tight">黔</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">为爱黔行</div>
              <div className="text-xs text-muted-foreground">
                公益项目协作平台
              </div>
            </div>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            Demo 演示版
          </span>
        </header>

        {/* Hero */}
        <section className="mb-14 max-w-2xl animate-fade-up">
          <div className="mb-5 flex items-center gap-2 text-xs font-medium text-accent">
            <span className="h-px w-8 bg-accent/60" />
            贵州 · 省级 5A 慈善组织
          </div>
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl">
            让每一个公益点位，
            <br />
            都有迹可循。
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            以「项目点位」为唯一核心资产底座，打通合作方透明反馈、待冠名点位自助认领、乡村老师极简打卡与机构统一管理四个环节。
          </p>
        </section>

        {/* 数据条 */}
        <section className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-5 py-5">
              <div className="tnum text-2xl font-semibold text-foreground">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {/* 端口入口 */}
        <section className="mb-14">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-lg font-semibold">选择端口开始体验</h2>
            <span className="text-xs text-muted-foreground">
              四个入口 · 同源数据
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {entries.map((e) => {
              const Icon = e.icon;
              return (
                <Link
                  key={e.title}
                  to={e.to}
                  aria-disabled={e.disabled}
                  className={
                    "group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 " +
                    (e.featured
                      ? "md:col-span-2 hover:border-primary/40 hover:shadow-lifted"
                      : "hover:-translate-y-0.5 hover:shadow-soft") +
                    (e.disabled ? " pointer-events-none opacity-40" : "")
                  }
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={
                        "grid h-11 w-11 shrink-0 place-items-center rounded-lg " +
                        (e.featured
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-primary")
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="tnum text-xs font-medium text-muted-foreground">
                          {e.index}
                        </span>
                        <h3 className="text-base font-semibold text-foreground">
                          {e.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {e.desc}
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="rounded border border-border px-1.5 py-0.5">
                          {e.meta}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 推荐路径 */}
        <section className="mb-14 rounded-xl border border-dashed border-border bg-card/50 p-5">
          <div className="mb-3 text-sm font-semibold">推荐体验路径</div>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-muted-foreground">
            {[
              "管理后台建档",
              "公开目录认领",
              "审核确权",
              "生成专属链接",
              "老师打卡",
              "审核入池",
            ].map((step, i, arr) => (
              <li key={step} className="flex items-center gap-2">
                <span className="tnum text-accent">{i + 1}</span>
                <span>{step}</span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-border" />
                )}
              </li>
            ))}
          </ol>
        </section>

        <footer className="flex flex-col items-center gap-3 border-t border-border pt-8">
          <Button variant="outline" size="sm" onClick={() => resetToSeed()}>
            <RotateCcw className="h-3.5 w-3.5" />
            重置 Demo 数据
          </Button>
          <p className="text-xs text-muted-foreground">
            数据持久化在浏览器本地，可随时恢复为初始种子数据
          </p>
        </footer>
      </div>
    </div>
  );
}
