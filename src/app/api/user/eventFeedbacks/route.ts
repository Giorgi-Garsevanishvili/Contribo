import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const data = await prisma.eventFeedback.findMany({
      where: {
        event: { regionId: thisUser.user.ownAllowance?.regionId },
        userId: thisUser.user.id,
      },
      select: {
        id: true,
        event: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json({
        message: `Event feedbacks made by you not found!`,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const deleted = await prisma.eventFeedback.deleteMany({
      where: {
        userId: thisUser.user.id,
        event: { regionId: thisUser.user.ownAllowance?.regionId },
      },
    });

    if (!deleted || deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All feedBacks made by user deleted!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
