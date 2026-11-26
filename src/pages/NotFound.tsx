import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, SearchX } from "lucide-react";

/** 兜底页：地址不匹配任何路由，或专属链接不可用 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center paper-bg px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-dashed border-border bg-card">
          <SearchX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold mb-2">页面不存在</h1>
        <p className="text-sm leading-relaxed text-muted-foreground mb-6">
          你访问的地址可能不完整或已经变更。
          <br />
          如果你是从机构收到的专属链接打开，说明链接已被重置或凭证有误，请联系对接人重新获取。
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
