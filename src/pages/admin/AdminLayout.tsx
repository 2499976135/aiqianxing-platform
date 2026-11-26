import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  ImagePlus,
  ClipboardCheck,
  Link as LinkIcon,
  BellRing,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePlatformStore } from "@/store/platformStore";
import { signOut } from "@/lib/auth";
import { getOverduePoints } from "@/lib/reminders";

const navItems: {
  to: string;
  end?: boolean;
  icon: typeof LayoutDashboard;
  label: string;
  needBadge?: boolean;
  needOverdue?: boolean;
}[] = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "工作台" },
  { to: "/admin/points", icon: MapPin, label: "点位管理" },
  { to: "/admin/materials", icon: ImagePlus, label: "素材中心" },
  { to: "/admin/reviews", icon: ClipboardCheck, label: "审核队列", needBadge: true },
  { to: "/admin/reminders", icon: BellRing, label: "跟进提醒", needOverdue: true },
  { to: "/admin/links", icon: LinkIcon, label: "链接管理" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pendingClaims = usePlatformStore((s) => s.pendingClaimCount());
  const pendingCheckIns = usePlatformStore((s) => s.pendingCheckInCount());
  const totalPending = pendingClaims + pendingCheckIns;
  const points = usePlatformStore((s) => s.points);
  const checkIns = usePlatformStore((s) => s.checkIns);
  const overdueCount = getOverduePoints(points, checkIns).length;

  const sidebar = (
    <>
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-xs font-bold">黔</span>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">为爱黔行</div>
          <div className="text-[11px] text-muted-foreground">
            公益项目协作平台
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/[0.07] font-medium text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-opacity",
                      isActive ? "bg-primary opacity-100" : "opacity-0",
                    )}
                  />
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.needBadge && totalPending > 0 && (
                    <span className="tnum grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-accent-foreground">
                      {totalPending > 99 ? "99+" : totalPending}
                    </span>
                  )}
                  {item.needOverdue && overdueCount > 0 && (
                    <span className="tnum grid h-5 min-w-5 place-items-center rounded-full bg-warning/15 px-1.5 text-[10px] font-semibold text-warning">
                      {overdueCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>待审 · 认领 {pendingClaims}</span>
          <span>打卡 {pendingCheckIns}</span>
        </div>
        <button
          onClick={() => {
            signOut();
            navigate("/admin/login", { replace: true });
          }}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
        >
          <LogOut className="h-3 w-3" />
          退出登录
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* 移动端顶栏 */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
            黔
          </div>
          <span className="text-sm font-semibold">管理后台</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="切换菜单"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      <div className="flex">
        <aside
          className={cn(
            "z-50 w-60 shrink-0 flex-col border-r border-border bg-card md:sticky md:top-0 md:flex md:h-screen",
            mobileMenuOpen
              ? "fixed inset-y-0 left-0 flex shadow-lifted"
              : "hidden",
          )}
        >
          {sidebar}
        </aside>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
