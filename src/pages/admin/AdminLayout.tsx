import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  ImagePlus,
  ClipboardCheck,
  Link as LinkIcon,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import RedDotBadge from "@/components/common/RedDotBadge";
import { usePlatformStore } from "@/store/platformStore";

const navItems = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "工作台" },
  { to: "/admin/points", icon: MapPin, label: "点位管理" },
  { to: "/admin/materials", icon: ImagePlus, label: "素材中心" },
  { to: "/admin/reviews", icon: ClipboardCheck, label: "审核队列", needBadge: true },
  { to: "/admin/links", icon: LinkIcon, label: "链接管理" },
];

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pendingClaims = usePlatformStore((s) => s.pendingClaimCount());
  const pendingCheckIns = usePlatformStore((s) => s.pendingCheckInCount());
  const totalPending = pendingClaims + pendingCheckIns;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar (mobile) */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="font-semibold">管理后台</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-white border-r flex-shrink-0 md:sticky md:top-0 md:h-screen w-64",
            mobileMenuOpen
              ? "fixed inset-y-0 left-0 z-50 block"
              : "hidden md:block",
          )}
        >
          <div className="p-5 border-b hidden md:block">
            <div className="font-bold text-lg text-slate-900">
              为爱黔行
            </div>
            <div className="text-xs text-slate-500 mt-0.5">公益协作平台 · 管理后台</div>
          </div>
          <nav className="p-3 space-y-1">
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
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-slate-600 hover:bg-slate-100",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.needBadge && totalPending > 0 && (
                    <span
                      className={cn(
                        "ml-auto text-xs px-1.5 py-0.5 rounded-full",
                      )}
                    >
                      <RedDotBadge count={totalPending} />
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-400">
            审核红点：认领 {pendingClaims} · 打卡 {pendingCheckIns}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
