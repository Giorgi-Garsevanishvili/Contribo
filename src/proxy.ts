import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { RestrictionCheck } from "./lib/restrictionCheck";

export async function proxy(req: NextRequest) {
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
    // Checks User Restriction Status
    const { restricted: GlobalRestriction } =
      await RestrictionCheck("RESTRICT");
    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (GlobalRestriction) {
      return NextResponse.redirect(new URL("/restricted", req.url));
    }
  }

  // Function Check is provided param is included in access list so in case of admin need to check opposite way.
  const { restricted: AdminRestriction } = await RestrictionCheck("ADMIN");

  if (pathname.startsWith("/admin") && !AdminRestriction) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/console/:path*", "/volunteer/:path*"],
};
