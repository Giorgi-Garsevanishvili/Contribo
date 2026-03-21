import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { updateEventFeedbackUser } from "@/lib/zod";
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
        user: { select: { name: true, image: true } },
        updatedBy: { select: { name: true } },
        feedback: true,
        rating: true,
        responded: true,
        respondedAt: true,
        requestStatus: true,
      },
    });

    if (!data) {
      return NextResponse.json({
        data,
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

    const json = (await req.json()) as z.infer<typeof updateEventFeedbackUser>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
      respondedAt: new Date(),
    };

    const body = updateEventFeedbackUser.parse(jsonWithCreator);

    const returnData = await prisma.$transaction(async (tx) => {
      const eventId = await tx.eventFeedback.findUnique({
        where: { id },
        select: { eventId: true },
      });
      const eventFeedbackCount = await tx.eventFeedback.findMany({
        where: { eventId: eventId?.eventId, requestStatus: "SUBMITTED" },
      });

      const totalEventRating = eventFeedbackCount.reduce((a, b) => {
        const A = a;
        const B = b.rating || 0;

        return A + B;
      }, 0);

      const avgEventScore =
        (totalEventRating + body.rating) / (eventFeedbackCount.length + 1);

      const updatedEventRating = await tx.event.update({
        where: { id: eventId?.eventId },
        data: { rating: Math.round(avgEventScore) },
      });

      return { avgEventScore };
    });

    const response = await prisma.eventFeedback.update({
      where: { id },
      data: body,
      select: { event: { select: { name: true } } },
    });

    return NextResponse.json(
      {
        message: `Feedback Updated for Event: ${response.event?.name}. Updated Rating: ${returnData.avgEventScore}`,
      },
      { status: 200 },
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
