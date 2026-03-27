import { AvailabilitySlotWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateAvailabilitySlot } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" });
    }

    const whereClause: AvailabilitySlotWhereInput = {
      eventId: id,
      event: { regionId: thisUser.user.ownAllowance?.regionId },
    };

    const data = await prisma.availabilitySlot.findMany({
      where: whereClause,
      include: {
        CreatedBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        role: { select: { name: true } },
        event: {
          select: {
            name: true,
            region: { select: { name: true } },
            finalizedAt: true,
          },
        },
        availabilityEntries: {
          select: { user: { select: { name: true } }, status: true },
        },
      },
    });

    if (!data) {
      return NextResponse.json({
        data,
        message: `Availability Slot For Event With ID: ${id} not found!`,
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

    if (!id) {
      return NextResponse.json({ message: "Id is missing" });
    }

    const json = (await req.json()) as z.infer<typeof CreateAvailabilitySlot>;
    const jsonWithCreator = {
      ...json,
      createdById: thisUser.user.id,
      eventId: id,
    };
    const body = CreateAvailabilitySlot.parse(jsonWithCreator);

    const response = await prisma.availabilitySlot.create({
      data: body,
      select: {
        event: { select: { name: true } },
        role: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: `Availability Slot Created For Event: ${response.event.name}, With Role: ${response.role.name}`,
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
