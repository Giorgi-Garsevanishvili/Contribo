import { AvailabilitySlotWhereUniqueInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { UpdateAvailabilitySlot } from "@/lib/zod";
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

    const whereClause: AvailabilitySlotWhereUniqueInput = {
      event: { regionId: thisUser.user?.regionId },
      id,
    };

    const response = await prisma.availabilitySlot.findUnique({
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
          select: { availabilityEntries: { where: { status: "ACTIVE" } } },
        },
      },
    });

    if (!response) {
      return NextResponse.json({
        response,
        message: `Availability Slot with ID: ${id} not found!`,
      });
    }

    const data = {
      ...response,
      totalCapacity: response.totalSlots,
      activeCount: response._count.availabilityEntries,
      available: response.totalSlots - response._count.availabilityEntries,
    };

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

    const json = (await req.json()) as z.infer<typeof UpdateAvailabilitySlot>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.userId,
    };

    const body = UpdateAvailabilitySlot.parse(jsonWithCreator);

    if (body.ratingScore) {
      const updatedData = await prisma.$transaction(async (tx) => {
        const updatedSlot = await tx.availabilitySlot.update({
          where: { id },
          data: body,
          select: { event: { select: { name: true } } },
        });

        const updatedEntries = await tx.availabilityEntry.updateMany({
          where: { slotId: id },
          data: body,
        });

        return { updatedSlot, updatedEntries };
      });

      return NextResponse.json(
        {
          message: `Availability Slot for Event: ${updatedData.updatedSlot.event.name} and Rating For ${updatedData.updatedEntries.count} Entries Updated`,
        },
        { status: 200 },
      );
    } else {
      const updatedData = await prisma.availabilitySlot.update({
        where: { id },
        data: body,
        select: { event: { select: { name: true } } },
      });

      return NextResponse.json(
        {
          message: `Availability Slot for Event: ${updatedData.event.name} Updated`,
        },
        { status: 200 },
      );
    }
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
      return NextResponse.json({ message: "Id is missing" });
    }

    const deleted = await prisma.availabilitySlot.delete({
      where: {
        id,
        event: {
          regionId: thisUser.user?.regionId,
        },
      },
      include: { event: { select: { name: true } } },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `Availability Slot For Event: ${deleted.event.name} Deleted`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
