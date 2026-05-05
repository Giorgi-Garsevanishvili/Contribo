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
      event: { regionId: thisUser.user?.regionId },
    };

    const response = await prisma.availabilitySlot.findMany({
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
        _count: {
          select: {
            availabilityEntries: {
              where: { status: "ACTIVE" },
            },
          },
        },
      },
    });

    const data = response.map((slot) => ({
      ...slot,
      totalCapacity: slot.totalSlots,
      activeCount: slot._count.availabilityEntries,
      available: slot.totalSlots - slot._count.availabilityEntries,
    }));

    if (!data || data.length === 0) {
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
      createdById: thisUser.user.userId,
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

export const DELETE = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing" });
    }

    const event = await prisma.event.findUnique({ where: { id } });

    const deleted = await prisma.availabilitySlot.deleteMany({
      where: {
        eventId: id,
        event: { regionId: thisUser.user?.regionId },
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Event Availability Slots Deleted for Event: ${event?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
