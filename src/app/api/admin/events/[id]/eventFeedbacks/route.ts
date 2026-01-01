import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }

    const data = await prisma.eventFeedback.findMany({
      where: {
        eventId: id,
        event: { regionId: thisUser.user.ownAllowance?.regionId },
      },
    });

    if (!data) {
      return NextResponse.json(
        {data, message: `Feedbacks for event with id: ${id}, not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is Missing" }, { status: 400 });
    }

    const deleted = await prisma.eventFeedback.deleteMany({
      where: {
        eventId: id,
        event: { regionId: thisUser.user.ownAllowance?.regionId },
      },
    });

    if (!deleted || deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted" });
    }

    return NextResponse.json({
      message: `All Feedback deleted for this event!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
