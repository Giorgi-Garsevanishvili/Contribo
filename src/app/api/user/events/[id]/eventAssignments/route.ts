import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    const data = await prisma.eventAssignment.findMany({
      where: {
        eventId: id,
        event: { regionId: thisUser.user.ownAllowance?.regionId },
        userId: thisUser.user.id,
      },
      include: {
        user: { select: { name: true, image: true } },
        createdBy: { select: { name: true, image: true } },
        updatedBy: { select: { name: true, image: true } },
        event: { select: { name: true } },
        role: { select: { name: true } },
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
        message: "Your Assignments For This Event not found!",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
