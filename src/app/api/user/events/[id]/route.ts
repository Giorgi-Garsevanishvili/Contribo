import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    const data = await prisma.event.findUnique({
      where: {
        id,
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
        description: true,
        rating: true,
        endTime: true,
        location: true,
        assignments: { select: { user: { select: { name: true } } } },
      },
    });

    if (!data) {
      return NextResponse.json({data,
        message: `Event with ${id} not found!`,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
