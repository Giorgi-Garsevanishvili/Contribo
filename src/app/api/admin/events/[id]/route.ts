import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { updateEvent } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const data = await prisma.event.findUnique({
      where: {
        id,
        regionId: thisUser.user?.regionId,
      },
      include: {
        availabilities: {
          select: {
            role: { select: { name: true } },
            availabilityEntries: {
              select: { user: { select: { name: true, image: true } } },
            },
            totalSlots: true,
            _count: {
              select: { availabilityEntries: { where: { status: "ACTIVE" } } },
            },
          },
        },
        assignments: {
          include: {
            user: { select: { name: true } },
            role: { select: { name: true } },
          },
        },
        updatedBy: { select: { name: true } },
        createdBy: { select: { name: true } },
        feedback: { include: { user: { select: { name: true } } } },
      },
    });

    if (!data) {
      return NextResponse.json({ data, message: "Event not found!" });
    }

    const now = new Date();

    const dataWithStatus = () => {
      let status: "UPCOMING" | "LIVE" | "ENDED";

      if (now < data.startTime) {
        status = "UPCOMING";
      } else if (now >= data.startTime && now <= data.endTime) {
        status = "LIVE";
      } else {
        status = "ENDED";
      }

      return {
        ...data,
        status,
      };
    };

    return NextResponse.json({ data: dataWithStatus() }, { status: 200 });
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

    const json = (await req.json()) as z.infer<typeof updateEvent>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.userId,
    };

    const body = updateEvent.parse(jsonWithCreator);

    await prisma.event.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ message: "Event Updated" }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const deleted = await prisma.event.delete({
      where: {
        id,
        regionId: thisUser.user?.regionId,
      },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `Event: ${deleted.name}, deleted. `,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
