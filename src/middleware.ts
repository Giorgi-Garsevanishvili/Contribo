import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

interface AuthToken {
  role?: string;
}

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.auth as AuthToken | null;

  console.log(token);

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/client", "/admin", "/base"],
};
