import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/common/EmptyState";
import { usePlatformStore } from "@/store/platformStore";
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

/** 老师查看本校打卡历史与审核状态 */
export default function TeacherHistory() {
  const { schoolCode } = useParams<{ schoolCode: string }>();
  const getPointBySchoolCode = usePlatformStore(
    (s) => s.getPointBySchoolCode,
  );
  const getCheckInsBySchoolCode = usePlatformStore(
    (s) => s.getCheckInsBySchoolCode,
  );

  const point = schoolCode ? getPointBySchoolCode(schoolCode) : undefined;
  const checkIns = schoolCode ? getCheckInsBySchoolCode(schoolCode) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 头部 */}
      <div className="bg-sky-700 text-white px-4 pt-6 pb-5">
        <Link to={`/t/${schoolCode}`} className="inline-flex items-center gap-1 text-sm opacity-90">
          <ArrowLeft className="h-4 w-4" /> 返回打卡
        </Link>
        <h1 className="text-xl font-bold mt-2">本校打卡记录</h1>
        <div className="text-sm opacity-80 mt-1">{point?.schoolName}</div>
      </div>

      <div className="px-4 py-4">
        {checkIns.length === 0 ? (
          <EmptyState
            title="暂无打卡记录"
            description="开始您的第一次课堂打卡吧"
          />
        ) : (
          <div className="space-y-3">
            {checkIns.map((ci) => (
              <div
                key={ci.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{ci.courseName}</div>
                  <Badge
                    variant={
                      ci.status === "approved"
                        ? "success"
                        : ci.status === "rejected"
                        ? "destructive"
                        : "warning"
                    }
                  >
                    {ci.status === "approved" && (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    )}
                    {ci.status === "rejected" && (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {ci.status === "pending" && (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {ci.status === "approved"
                      ? "审核通过"
                      : ci.status === "rejected"
                      ? "已驳回"
                      : "待审核"}
                  </Badge>
                </div>

                <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {ci.submittedAt} · {ci.teacherName}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {ci.content}
                </p>

                {ci.reviewNote && (
                  <div className="mt-2 pt-2 border-t text-xs text-amber-700 bg-amber-50 rounded p-2">
                    <b>机构回复：</b> {ci.reviewNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {checkIns.length > 0 && (
          <div className="mt-6 text-center">
            <Button asChild size="lg" className="h-14 text-base w-full">
              <Link to={`/t/${schoolCode}`}>继续打卡</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
