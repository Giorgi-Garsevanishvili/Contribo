import "server-only";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return session;
}

export async function requireRole(requiredRole: string) {
  const session = await requireAuth();

  if (!session.user?.roles?.includes(requiredRole)) {
    redirect("/unauthorized");
  }

  return session;
}

export async function requireAnyRole(roles: string[]) {
  const session = await requireAuth();

  if (!roles.some((role) => session.user?.roles?.includes(role))) {
    redirect("/unauthorized");
  }

  return session;
}
