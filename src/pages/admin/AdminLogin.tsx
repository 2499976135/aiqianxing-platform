import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { signIn, isSignedIn, DEMO_ACCOUNT } from "@/lib/auth";

/** 管理后台登录页：仅机构内部工作人员使用 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isSignedIn()) navigate("/admin", { replace: true });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const ok = signIn(username, password);
    setSubmitting(false);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("账号或密码不正确，请核对后重试");
    }
  };

  return (
    <div className="paper-bg flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-xs font-bold">黔</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">为爱黔行</div>
            <div className="text-[11px] text-muted-foreground">
              公益项目协作平台
            </div>
          </div>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" />
          返回首页
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold">工作人员登录</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              仅限机构内部员工访问项目后台
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">账号</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="请输入员工账号"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="rounded-md bg-destructive/[0.08] px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                登录
              </Button>
            </div>

            <p className="mt-4 border-t border-border pt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
              演示账号：{DEMO_ACCOUNT.username} / {DEMO_ACCOUNT.password}
            </p>
          </form>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            合作方请使用机构发送的专属链接，老师请使用学校专属链接进入
          </p>
        </div>
      </main>
    </div>
  );
}
