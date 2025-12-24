import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateEvent } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const data = await prisma.event.findMany({
      where: {
        regionId: thisUser.user.ownAllowance?.regionId,
      },
      select: {
        id: true,
        region: { select: { name: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        name: true,
        startTime: true,
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        message: "Events in your region not found!",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const json = (await req.json()) as z.infer<typeof CreateEvent>;
    const jsonWithCreator = {
      ...json,
      createdById: thisUser.user.id,
      regionId: thisUser.user.ownAllowance?.regionId,
    };
    const body = CreateEvent.parse(jsonWithCreator);

    const response = await prisma.event.create({
      data: body,
      include: {
        createdBy: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: `Event: ${response.name}, Created By: ${response.createdBy?.name}`,
      },
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const deleted = await prisma.event.deleteMany({
      where: {
        regionId: thisUser.user.ownAllowance?.regionId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Events deleted for region: ${thisUser.user.ownAllowance?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
