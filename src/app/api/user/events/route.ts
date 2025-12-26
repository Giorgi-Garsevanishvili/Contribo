import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const data = await prisma.event.findMany({
      where: {
        regionId: thisUser.user.ownAllowance?.regionId,
        assignments: { some: { userId: thisUser.user.id } },
      },
      select: {
        id: true,
        region: { select: { name: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        name: true,
        startTime: true,
        assignments: { select: { user: { select: { name: true } } } },
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        message: "Events for you not found!",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
