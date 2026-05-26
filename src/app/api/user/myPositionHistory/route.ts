import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const data = await prisma.positionHistory.findMany({
      where: {
        userId: thisUser.user.userId!,
        user: {
          ownAllowance: { regionId: thisUser.user?.regionId },
        },
      },
      select: {
        user: { select: { name: true } },
        position: { select: { name: true } },
        id: true,
        ended: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        startedAt: true,
        endedAt: true,
      },
      orderBy: { startedAt: "desc" },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
        message: `Position History for user you in this region not found!`,
      });
    }

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
