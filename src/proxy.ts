import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { RestrictionCheck } from "./lib/restrictionCheck";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await auth();

  // Home page redirect
  if (pathname === "/") {
    if (session) {
      const roles = session?.user.roles as string[];

      const priority = [
        { name: "RESTRICT", path: "/restricted" },
        { name: "REGULAR", path: "/volunteer" },
        { name: "ADMIN", path: "/admin" },
        { name: "QIRVEX", path: "/console" },
      ];

      for (const role of priority) {
        if (roles.includes(role.name)) {
          return NextResponse.redirect(new URL(role.path, req.url));
        }
      }

      return NextResponse.redirect(new URL("/unauthorized", req.url));
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
