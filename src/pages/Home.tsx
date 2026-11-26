import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  LogIn,
  MapPin,
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  Music4,
  Dumbbell,
  Lamp,
  Sparkles,
} from "lucide-react";
import { usePlatformStore } from "@/store/platformStore";
import { POINT_TYPE_LABEL } from "@/data/seed";

const TYPE_ICON: Record<string, typeof MapPin> = {
  music_classroom: Music4,
  basketball_classroom: Dumbbell,
  street_light: Lamp,
  other: Sparkles,
};

/** 三类项目的介绍内容 */
const PROGRAMS = [
  {
    tag: "长期",
    title: "乡村音乐教室",
    desc: "为乡村学校改建音乐教室，配齐数码钢琴与民乐器材，让音乐课真正开起来。",
    note: "三年运维：课程支持、器材维护与教师培训。",
    image:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Photorealistic%20documentary%20photo%20of%20a%20bright%20rural%20school%20music%20classroom%20in%20Guizhou%20China%2C%20children%20playing%20electronic%20pianos%2C%20warm%20natural%20window%20light%2C%20authentic%20and%20hopeful&image_size=landscape_4_3",
    alt: "贵州乡村小学音乐教室，孩子们在弹奏电钢琴",
  },
  {
    tag: "短期",
    title: "乡村篮球场",
    desc: "硬化场地并铺设环保塑胶，配套篮球架与训练器材，交付即可使用。",
    note: "一次性交付，完工后由学校负责日常使用。",
    image:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Photorealistic%20photo%20of%20a%20newly%20built%20outdoor%20basketball%20court%20at%20a%20rural%20primary%20school%20in%20mountainous%20Guizhou%20China%2C%20children%20playing%2C%20late%20afternoon%20sunlight&image_size=landscape_4_3",
    alt: "贵州山区乡村小学新建的篮球场，孩子们在打球",
  },
  {
    tag: "长期",
    title: "太阳能路灯",
    desc: "为村道与校园安装太阳能路灯，照亮孩子上下学的那段夜路。",
    note: "五年质保，定期巡检与故障更换。",
    image:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Photorealistic%20photo%20of%20solar%20street%20lamps%20lighting%20a%20village%20road%20at%20dusk%20in%20rural%20Guizhou%20China%2C%20mountains%20in%20background%2C%20warm%20lamplight&image_size=landscape_4_3",
    alt: "贵州乡村傍晚亮起的太阳能路灯与远处山峦",
  },
];

/** 一个点位的三年：四个阶段 */
const TIMELINE = [
  {
    step: "01",
    title: "立项与冠名",
    desc: "确认点位与冠名方式，签署协议，明确交付清单与反馈节奏。",
  },
  {
    step: "02",
    title: "建设与验收",
    desc: "按清单施工与采购，完工后由机构、学校与冠名方共同验收。",
  },
  {
    step: "03",
    title: "开课与打卡",
    desc: "学校老师用专属链接打卡，课堂记录与素材按月留存。",
  },
  {
    step: "04",
    title: "持续运维与反馈",
    desc: "长期点位持续三年巡检与课程支持，进展按月对外发布。",
  },
];

/** 对外官网首页：面向公众与合作意向方，不出现任何后台入口 */
export default function Home() {
  const points = usePlatformStore((s) => s.points);
  const progress = usePlatformStore((s) => s.progress);

  // 对外只展示已发布的进展，按发布时间倒序取最新 3 条
  const latestProgress = [...progress]
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  const built = points.filter((p) => p.status !== "pending_claim");
  const pending = points.filter((p) => p.status === "pending_claim");
  const schools = new Set(
    points.map((p) => p.schoolName).filter(Boolean) as string[],
  );

  const stats = [
    { label: "已落地点位", value: built.length, suffix: "个" },
    { label: "覆盖乡村学校", value: schools.size, suffix: "所" },
    {
      label: "长期运维项目",
      value: points.filter((p) => p.longTerm).length,
      suffix: "个",
    },
    { label: "待冠名点位", value: pending.length, suffix: "个" },
  ];

  return (
    <div className="paper-bg min-h-screen">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xs font-bold">黔</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">为爱黔行</div>
              <div className="hidden text-[11px] text-muted-foreground sm:block">
                贵州省为爱黔行公益服务中心
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#projects" className="transition-colors hover:text-primary">
              待冠名点位
            </a>
            <a href="#roles" className="transition-colors hover:text-primary">
              参与方式
            </a>
            <a href="#about" className="transition-colors hover:text-primary">
              关于我们
            </a>
          </nav>

          <Button asChild variant="outline" size="sm">
            <Link to="/admin/login">
              <LogIn className="h-3.5 w-3.5" />
              <span className="ml-1.5">工作人员登录</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <div className="max-w-2xl animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            省级 5A 慈善组织 · 贵州
          </div>
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-[3.25rem]">
            让每一个公益点位，
            <br />
            都有迹可循。
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            我们为贵州乡村学校建设音乐教室、篮球场与太阳能路灯，并把每个点位的建设进展、每一次课堂记录，
            完整、透明地交到冠名合作方手中。
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/claim">
                查看待冠名点位
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#roles">了解如何参与</a>
            </Button>
          </div>
        </div>
      </section>

      {/* 数据 */}
      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-7">
              <div className="flex items-baseline gap-1">
                <span className="tnum text-3xl font-semibold">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.suffix}</span>
              </div>
              <div className="mt-1.5 text-xs text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 我们在做什么 */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">我们在做什么</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          三类项目，同一套透明的交付标准。
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PROGRAMS.map((item) => (
            <div
              key={item.title}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lifted"
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="h-44 w-full object-cover"
              />
              <div className="p-6">
                <Badge variant="outline" className="text-[11px]">
                  {item.tag}
                </Badge>
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 待冠名点位 */}
      <section id="projects" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              这些点位，还在等待一个名字
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              认领后即可冠名，我们按月向你反馈建设与课堂进展。
            </p>
          </div>
          <Link
            to="/claim"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            查看全部点位
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
            <p className="text-sm text-muted-foreground">
              当前点位均已有合作方，感谢每一份支持。
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.slice(0, 3).map((p) => {
              const Icon = TYPE_ICON[p.type] ?? MapPin;
              return (
                <Link
                  key={p.id}
                  to="/claim"
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lifted"
                >
                  <div className="flex h-32 items-center justify-center bg-secondary">
                    <Icon className="h-9 w-9 text-primary/45" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded border border-border px-1.5 py-0.5">
                        {POINT_TYPE_LABEL[p.type] ?? "公益点位"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {p.region}
                      </span>
                    </div>
                    <h3 className="mt-2.5 line-clamp-1 text-base font-semibold">
                      {p.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      查看详情
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 一个点位的三年 */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          一个点位的三年
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          长期点位不是一次性交付，而是持续三年的陪伴。
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {TIMELINE.map((item, i) => (
            <div key={item.step}>
              <div className="flex items-center gap-3">
                <span className="tnum text-sm font-semibold text-accent">
                  {item.step}
                </span>
                {i < TIMELINE.length - 1 && (
                  <span className="hidden h-px flex-1 bg-border md:block" />
                )}
              </div>
              <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 参与方式 */}
      <section id="roles" className="border-y border-border bg-card/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">三种参与方式</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            不同身份使用不同入口，互不干扰。
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "冠名合作方",
                desc: "在点位目录提交认领意向，经机构确认后获得专属进展链接，随时查看项目动态。",
                action: "进入点位目录",
                to: "/claim",
              },
              {
                icon: GraduationCap,
                title: "乡村学校老师",
                desc: "使用学校下发的专属链接即可打卡，无需注册登录，弱网也能保存草稿。",
                action: "联系项目主管获取链接",
                to: "#about",
              },
              {
                icon: Users,
                title: "公众与志愿者",
                desc: "浏览已落地项目，了解每一个点位的真实进展，也欢迎转发给身边的企业伙伴。",
                action: "查看待冠名点位",
                to: "/claim",
              },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="bg-card p-7">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{r.title}</h3>
                  <p className="mt-2 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground">
                    {r.desc}
                  </p>
                  <Link
                    to={r.to}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    {r.action}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 最新项目动态 */}
      {latestProgress.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              最新项目动态
            </h2>
            <Link
              to="/claim"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              查看待认领点位
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {latestProgress.map((item) => {
              const pointName =
                points.find((p) => p.id === item.pointId)?.name ?? "公益点位";
              return (
                <Link
                  key={item.id}
                  to="/claim"
                  className="group flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lifted"
                >
                  <span className="tnum shrink-0 pt-0.5 text-xs text-muted-foreground">
                    {item.publishedAt}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-muted-foreground">
                      {pointName}
                    </div>
                    <h3 className="mt-1 text-sm font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {item.content}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 关于 */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-accent">
              <span className="h-px w-8 bg-accent/60" />
              关于我们
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              扎根贵州，做长期主义的乡村公益
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              贵州省为爱黔行公益服务中心是省级 5A 慈善组织，长期在贵州乡村学校开展音乐教室、篮球场与乡村照明等公益项目。
            </p>
            <p>
              我们相信透明本身就是一种尊重：每一个点位的建设进度、每一堂课的现场记录，都会完整地呈现给冠名合作方，不做选择性展示。
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-2 text-sm">
              <span className="text-foreground">
                合作咨询：<span className="text-primary">cooperation@weiaiqianxing.org</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 合作召唤 */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="rounded-xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            让下一个点位，因为你的名字而不同
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
            认领一个点位，我们会把建设、开课与运维的每一步如实交到你手中。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link to="/claim">查看待冠名点位</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href="mailto:cooperation@weiaiqianxing.org">合作咨询</a>
            </Button>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="text-xs text-muted-foreground">
            © 2026 贵州省为爱黔行公益服务中心 · 让每一份善意都被看见
          </div>
          <Link
            to="/demo"
            className="text-[11px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            演示导航
          </Link>
        </div>
      </footer>
    </div>
  );
}
