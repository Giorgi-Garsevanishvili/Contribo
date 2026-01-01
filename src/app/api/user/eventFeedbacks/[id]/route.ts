import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { updateEventFeedback } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    const data = await prisma.eventFeedback.findUnique({
      where: {
        id,
        event: { regionId: thisUser.user.ownAllowance?.regionId },
        userId: thisUser.user.id,
      },
      select: {
        id: true,
        event: { select: { name: true } },
        user: { select: { name: true } },
        updatedBy: { select: { name: true } },
        feedback: true,
        rating: true,
      },
    });

    if (!data) {
      return NextResponse.json({data,
        message: `Event feedback with ${id} not found!`,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const PUT = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing!" });
    }

    const json = (await req.json()) as z.infer<typeof updateEventFeedback>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = updateEventFeedback.parse(jsonWithCreator);

    const response = await prisma.eventFeedback.update({
      where: { id },
      data: body,
      select: { event: { select: { name: true } } },
    });

    return NextResponse.json(
      { message: `Feedback Updated for Event: ${response.event?.name}` },
      { status: 200 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    const deleted = await prisma.eventFeedback.delete({
      where: {
        id,
        userId: thisUser.user.id,
      },
      select: {
        user: { select: { name: true } },
        event: { select: { name: true } },
      },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `FeedBack for Event ${deleted.event?.name} deleted! `,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
