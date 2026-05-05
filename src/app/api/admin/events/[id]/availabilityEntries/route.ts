import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing" });
    }

    const data = await prisma.availabilityEntry.findMany({
      where: { slot: { eventId: id, event: { regionId: thisUser.user.userId } } },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
        message: `Availability Entries For Event with ID: ${id}, not found!`,
      });
    }

    return NextResponse.json(data, { status: 200 });
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
      return NextResponse.json({ message: "id is missing" });
    }

    const event = await prisma.event.findUnique({ where: { id } });

    const deleted = await prisma.availabilityEntry.deleteMany({
      where: {
        slot: {
          eventId: id,
          event: { regionId: thisUser.user?.regionId },
        },
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Event Availability Entries Deleted for Event: ${event?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
