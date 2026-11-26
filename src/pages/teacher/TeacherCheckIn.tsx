import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePlatformStore } from "@/store/platformStore";
import {
  User,
  BookOpen,
  Camera,
  Upload,
  History,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

/** ④ 乡村老师手机网页打卡端 — 大字一屏 · 弱网友好 */
const DRAFT_KEY = "teacher-checkin-draft";

interface DraftData {
  teacherName: string;
  courseName: string;
  content: string;
}

export default function TeacherCheckIn() {
  const { schoolCode } = useParams<{ schoolCode: string }>();
  const getPointBySchoolCode = usePlatformStore(
    (s) => s.getPointBySchoolCode,
  );
  const submitCheckIn = usePlatformStore((s) => s.submitCheckIn);

  const point = schoolCode ? getPointBySchoolCode(schoolCode) : undefined;

  // 表单状态
  const [teacherName, setTeacherName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动加载学校信息 + 恢复草稿
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 恢复草稿
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft: DraftData = JSON.parse(raw);
        if (draft.teacherName) setTeacherName(draft.teacherName);
        if (draft.courseName) setCourseName(draft.courseName);
        if (draft.content) setContent(draft.content);
      }
    } catch {}

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 草稿自动暂存
  useEffect(() => {
    const draft: DraftData = { teacherName, courseName, content };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [teacherName, courseName, content]);

  // 图片转 dataURL 模拟上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!point) return;
    if (!teacherName.trim() || !courseName.trim() || !content.trim()) {
      alert("请填写完整的打卡信息");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    submitCheckIn({
      pointId: point.id,
      schoolCode: point.schoolCode ?? "",
      schoolName: point.schoolName ?? "",
      teacherName: teacherName.trim(),
      courseName: courseName.trim(),
      content: content.trim(),
      images,
      videos: [],
    });
    // 清空草稿
    localStorage.removeItem(DRAFT_KEY);
    setSuccess(true);
    setSubmitting(false);
  };

  // 学校不存在（链接错误或点位已结束）
  if (!point) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold mb-2">学校链接无效</h1>
          <p className="text-slate-500 text-sm mb-6">
            抱歉，无法识别您的学校入口。请联系公益机构获取最新打卡链接。
          </p>
          <Button asChild variant="outline">
            <Link to="/">返回首页</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 成功页
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-xl font-bold mb-2">提交成功！</h1>
          <p className="text-sm text-slate-600 mb-1">
            您的打卡已提交，等待机构审核中。
          </p>
          <p className="text-xs text-slate-500 mb-6">
            审核结果将在 1-3 个工作日内通知您
          </p>
          <Button asChild>
            <Link to={`/t/${schoolCode}/history`}>
              <History className="h-4 w-4 mr-2" /> 查看本校历史记录
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 学校识别头部 */}
      <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white px-5 pt-6 pb-4">
        <div className="text-xs opacity-80 mb-1">您正在打卡</div>
        <h1 className="text-lg font-bold leading-tight">{point.schoolName}</h1>
        <div className="flex items-center justify-between mt-3">
          <Badge
            variant="outline"
            className="border-white/30 text-white/90 bg-white/10"
          >
            {point.name}
          </Badge>
          <div className="flex items-center gap-1 text-xs opacity-90">
            {online ? (
              <>
                <Wifi className="h-3 w-3" /> 网络良好
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-amber-300" /> 离线（已本地暂存）
              </>
            )}
          </div>
        </div>
      </div>

      {/* 一屏表单 — 大字大按钮 */}
      <div className="px-4 -mt-2">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-5">
          {/* 姓名 */}
          <div>
            <label className="block text-base font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-sky-600" /> 我的姓名
            </label>
            <Input
              size={undefined}
              className="h-14 text-base"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="请输入您的姓名"
            />
          </div>

          {/* 课程名称 */}
          <div>
            <label className="block text-base font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-sky-600" /> 今天上的课
            </label>
            <Input
              className="h-14 text-base"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="如：第一节音乐课：认识钢琴"
            />
          </div>

          {/* 课程内容 */}
          <div>
            <label className="block text-base font-medium mb-2">
              课堂记录
            </label>
            <Textarea
              className="text-base min-h-[120px]"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="简单写几句今天上课的情况，让公益机构和捐赠方了解孩子们的收获～"
            />
          </div>

          {/* 拍照 */}
          <div>
            <label className="block text-base font-medium mb-2 flex items-center gap-2">
              <Camera className="h-4 w-4 text-sky-600" /> 拍几张照片
              <span className="text-xs text-slate-400 ml-1 font-normal">
                （可多张，非必填）
              </span>
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white text-xs"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              className="w-full h-16 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 text-base flex items-center justify-center gap-2 active:bg-slate-100"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5" />
              {images.length > 0 ? "继续添加照片" : "点击上传照片"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* 历史链接 */}
        <div className="mt-4 text-center">
          <Link
            to={`/t/${schoolCode}/history`}
            className="text-sm text-sky-600 inline-flex items-center gap-1"
          >
            <History className="h-4 w-4" /> 查看本校审核记录
          </Link>
        </div>
      </div>

      {/* 底部固定提交按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          className="w-full h-14 text-lg"
          size="lg"
          onClick={handleSubmit}
          disabled={submitting || !online}
        >
          {submitting
            ? "提交中..."
            : !online
            ? "离线中（网络恢复后再提交）"
            : "提交打卡"}
        </Button>
      </div>
    </div>
  );
}
