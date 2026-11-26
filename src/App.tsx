import { Routes, Route, Navigate } from "react-router-dom";
import DemoEntry from "@/pages/DemoEntry";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPoints from "@/pages/admin/AdminPoints";
import AdminMaterials from "@/pages/admin/AdminMaterials";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminLinks from "@/pages/admin/AdminLinks";
import PartnerFeedback from "@/pages/partner/PartnerFeedback";
import ClaimDirectory from "@/pages/claim/ClaimDirectory";
import TeacherCheckIn from "@/pages/teacher/TeacherCheckIn";
import TeacherHistory from "@/pages/teacher/TeacherHistory";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Demo 入口总览页 */}
      <Route path="/" element={<DemoEntry />} />

      {/* ① 机构统一管理后台 */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="points" element={<AdminPoints />} />
        <Route path="materials" element={<AdminMaterials />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="links" element={<AdminLinks />} />
      </Route>

      {/* ② 合作方专属进展反馈页 */}
      <Route path="/p/:token" element={<PartnerFeedback />} />

      {/* ③ 待冠名点位认领目录 */}
      <Route path="/claim" element={<ClaimDirectory />} />

      {/* ④ 乡村老师手机打卡端 */}
      <Route path="/t/:schoolCode" element={<TeacherCheckIn />} />
      <Route path="/t/:schoolCode/history" element={<TeacherHistory />} />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
