const SESSION_KEY = "aqx-admin-session";

/** Demo 演示账号（正式接入飞书 SSO 后移除） */
export const DEMO_ACCOUNT = { username: "admin", password: "aiqianxing" };

export function signIn(username: string, password: string): boolean {
  if (
    username.trim() === DEMO_ACCOUNT.username &&
    password === DEMO_ACCOUNT.password
  ) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ username, signedAt: new Date().toISOString() }),
    );
    return true;
  }
  return false;
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isSignedIn(): boolean {
  try {
    return Boolean(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
}
