import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

interface AuthToken {
  user?: {
    role?: string;
  };
}

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.auth as AuthToken | null;

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/redirect", req.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (pathname.startsWith("/admin") && token.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/client") && token.user?.role !== "CLIENT") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }


  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/client", "/admin", "/base"],
};
