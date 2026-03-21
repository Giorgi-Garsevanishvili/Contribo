import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { updateEventFeedbackAdmin } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }

    const data = await prisma.eventFeedback.findUnique({
      where: { id, event: { regionId: thisUser.user.ownAllowance?.regionId } },
      include: {
        user: { select: { name: true, image: true } },
        event: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json(
        { data, message: `Event Feedback with id: ${id}, not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing!" });
    }

    const json = (await req.json()) as z.infer<typeof updateEventFeedbackAdmin>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = updateEventFeedbackAdmin.parse(jsonWithCreator);

    const response = await prisma.eventFeedback.update({
      where: { id },
      data: body,
      select: { event: { select: { name: true } } },
    });

    return NextResponse.json(
      { message: `Feedback Updated for Event: ${response.event?.name}` },
      { status: 200 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is Missing" }, { status: 400 });
    }

    const deleted = await prisma.eventFeedback.delete({
      where: { id, event: { regionId: thisUser.user.ownAllowance?.regionId } },
      select: {
        user: { select: { name: true } },
        event: { select: { name: true } },
      },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted" });
    }

    return NextResponse.json({
      message: `Feedback for event: ${deleted.event.name}, made by: ${deleted.user?.name}, deleted!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
