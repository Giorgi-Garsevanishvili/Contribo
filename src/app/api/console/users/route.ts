import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const users = await prisma.user.findMany();

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "users not found" }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
