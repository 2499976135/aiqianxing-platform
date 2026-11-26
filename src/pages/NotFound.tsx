import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          链接无效或已失效
        </h1>
        <p className="text-slate-500 mb-6">
          抱歉，该专属链接可能已被重置或超出访问范围。请联系公益机构获取最新访问链接。
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/">
              <Home className="h-4 w-4" /> 返回首页
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/claim">
              <Search className="h-4 w-4" /> 浏览公开点位
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
