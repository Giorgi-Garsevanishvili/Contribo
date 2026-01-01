import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateEventAssignment } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const data = await prisma.eventAssignment.findMany({
      where: {
        eventId: id,
        event: { regionId: thisUser.user.ownAllowance?.regionId },
      },
      select: {
        id: true,
        user: { select: { name: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        event: { select: { name: true } },
        role: { select: { name: true } },
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({data,
        message: "Assignments For This Event not found!",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const json = (await req.json()) as z.infer<typeof CreateEventAssignment>;
    const jsonWithCreator = {
      ...json,
      createdById: thisUser.user.id,
      eventId: id,
    };
    const body = CreateEventAssignment.parse(jsonWithCreator);

    const response = await prisma.eventAssignment.create({
      data: body,
      select: {
        event: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: `Event Assignment for Event: ${response.event?.name}, Created For: ${response.user?.name}`,
      },
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
