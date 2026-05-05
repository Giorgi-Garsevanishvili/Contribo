import { AvailabilitySlotWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" });
    }

    const whereClause: AvailabilitySlotWhereInput = {
      eventId: id,
      event: { regionId: thisUser.user?.regionId },
      published: true,
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
          where: { status: "ACTIVE" },
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

    if (!response) {
      return NextResponse.json({
        response,
        message: `Availability Slot For Event With ID: ${id} not found!`,
      });
    }

    const data = response.map((slot) => ({
      ...slot,
      totalCapacity: slot.totalSlots,
      activeCount: slot._count.availabilityEntries,
      available: slot.totalSlots - slot._count.availabilityEntries,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
