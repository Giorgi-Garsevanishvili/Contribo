import "server-only";

import { auth } from "./auth";

interface AuthError extends Error {
  status?: number;
}

export const requireRole = async (role: string) => {
  const session = await auth();

  if (!session || session.user.role !== role) {
    const err: AuthError = new Error("Unauthorized access");
    err.status = 403;
    throw err;
  }

  return session;
};
