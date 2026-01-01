import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { updateEventAssignment } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const data = await prisma.eventAssignment.findUnique({
      where: {
        id,
        event: { regionId: thisUser.user.ownAllowance?.regionId },
      },
      include: {
        user: { select: { name: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        event: { select: { name: true } },
        role: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json({data,
        message: "Assignments not found!",
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
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing!" });
    }

    const json = (await req.json()) as z.infer<typeof updateEventAssignment>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = updateEventAssignment.parse(jsonWithCreator);

    await prisma.eventAssignment.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      { message: "Event Assignment Updated" },
      { status: 200 }
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

    const deleted = await prisma.eventAssignment.delete({
      where: {
        id,
        event: { regionId: thisUser.user.ownAllowance?.regionId },
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
      message: `Event Assignment For User: ${deleted.user?.name}, deleted in Event: ${deleted.event.name}. `,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
