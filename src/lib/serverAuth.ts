import { NextResponse } from "next/server";
import { auth } from "./auth";

export const requireRole = async (role: string) => {
  const session = await auth();

  if (!session || session.user.role !== role) {
    const err = new Error("Unauthorized access");
    (err as any).status = 403;
    throw err;
  } //Need to be fixed

  return session;
};
