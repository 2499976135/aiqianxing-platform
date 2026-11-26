import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import DemoEntry from "@/pages/DemoEntry";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPoints from "@/pages/admin/AdminPoints";
import AdminMaterials from "@/pages/admin/AdminMaterials";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminReminders from "@/pages/admin/AdminReminders";
import AdminLinks from "@/pages/admin/AdminLinks";
import PartnerFeedback from "@/pages/partner/PartnerFeedback";
import ClaimDirectory from "@/pages/claim/ClaimDirectory";
import TeacherCheckIn from "@/pages/teacher/TeacherCheckIn";
import TeacherHistory from "@/pages/teacher/TeacherHistory";
import NotFound from "@/pages/NotFound";
import { isSignedIn } from "@/lib/auth";

/** 后台路由守卫：未登录跳转登录页 */
function RequireAdmin({ children }: { children: React.ReactNode }) {
  if (!isSignedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* 对外官网首页 */}
      <Route path="/" element={<Home />} />

      {/* 演示导航（仅内部评审使用，不在正式导航暴露） */}
      <Route path="/demo" element={<DemoEntry />} />

      {/* ① 机构统一管理后台（需登录） */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="points" element={<AdminPoints />} />
        <Route path="materials" element={<AdminMaterials />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="reminders" element={<AdminReminders />} />
        <Route path="links" element={<AdminLinks />} />
      </Route>

      {/* ② 合作方专属进展反馈页（专属链接直达，免登录） */}
      <Route path="/p/:token" element={<PartnerFeedback />} />

      {/* ③ 待冠名点位认领目录（公开） */}
      <Route path="/claim" element={<ClaimDirectory />} />

      {/* ④ 乡村老师手机打卡端（学校短码直达，免登录） */}
      <Route path="/t/:schoolCode" element={<TeacherCheckIn />} />
      <Route path="/t/:schoolCode/history" element={<TeacherHistory />} />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
