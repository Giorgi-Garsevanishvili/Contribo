import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  // Home page redirect
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/redirect", req.url));
    }
    return NextResponse.next();
  }

  // Protect routes
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/console") ||
    pathname.startsWith("/volunteer")
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/console/:path*",
    "/volunteer/:path*",
  ],
};
