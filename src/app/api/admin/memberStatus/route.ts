import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("ADMIN");

    const memberStatuses = await prisma.memberStatus.findMany();

    if (!memberStatuses || memberStatuses.length === 0) {
      return NextResponse.json(
        { message: "Member status not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(memberStatuses);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
