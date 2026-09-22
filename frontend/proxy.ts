import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const hasSession = request.cookies.has("access_token");

  if (!isPublic && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // /api/* is rewritten straight through to the backend (which enforces its
  // own auth) — the guard here must not intercept it, or the login call
  // itself gets redirected before it ever reaches the backend.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
