import "server-only";

import { auth } from "./auth";
import { prisma } from "./prisma";

interface AuthError extends Error {
  status?: number;
}

export const requireRole = async (role: string) => {
  const session = await auth();

  if (!session?.user.email) {
    const err: AuthError = new Error("Unauthorized access");
    err.status = 403;
    throw err;
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      ownAllowance: {
        select: { roles: { select: { role: { select: { name: true } } } }, region: true, regionId: true },
      },
    },
  });

  if (!dbUser || !dbUser.ownAllowance) {
    const err: AuthError = new Error("User has no role");
    err.status = 403;
    throw err;
  }

  const hasRole = dbUser.ownAllowance.roles.some((r) => r.role.name === role);
  if (!hasRole) {
    const err: AuthError = new Error("Unauthorized access");
    err.status = 403;
    throw err;
  }

  return { user: dbUser };
};
