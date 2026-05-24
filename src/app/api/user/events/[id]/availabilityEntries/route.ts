import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import {
  CreateAvailabilityEntry,
  DeleteAvailabilitySlotVolunteer,
} from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest) => {
  return;
};

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing" });
    }

    const json = (await req.json()) as z.infer<typeof CreateAvailabilityEntry>;

    const jsonWithCreator = {
      ...json,
      userId: thisUser.user.userId!,
      status: "ACTIVE" as "ACTIVE" | "CANCEL_REQUESTED" | "CANCELLED",
    };

    const creationResponse = await prisma.$transaction(async (tx) => {
      const totalSlots = await tx.availabilitySlot.findUnique({
        where: { id: json.slotId },
        select: {
          totalSlots: true,
          eventId: true,
          event: { select: { startTime: true, endTime: true } },
          validFrom: true,
          validTo: true,
        },
      });

      if (!totalSlots) {
        throw new Error("Slot Not Found");
      }

      // prevent claim if Event Ended
      const now = new Date();
      if (totalSlots.event.endTime <= now) {
        return {
          success: false,
          message: "Event Already Ended",
        };
      }

      // prevent duplicate same slot
      const existingSameSlot = await tx.availabilityEntry.findFirst({
        where: {
          userId: thisUser.user.userId!,
          slotId: json.slotId,
          status: "ACTIVE",
        },
      });

      if (existingSameSlot) {
        return {
          success: false,
          message: "You already have this slot",
        };
      }

      // Overlap Prevention
      const overlappingAvailability = await tx.availabilityEntry.findFirst({
        where: {
          userId: thisUser.user.userId!,
          status: "ACTIVE",
          slot: {
            validFrom: {
              lt: totalSlots.validTo as Date,
            },
            validTo: {
              gt: totalSlots.validFrom as Date,
            },
          },
        },
        select: { slot: { select: { event: { select: { name: true } } } } },
      });

      if (overlappingAvailability) {
        return {
          success: false,
          message: `You have overlapping availability in Event: ${overlappingAvailability.slot.event.name}`,
        };
      }

      const overlappingAssignment = await tx.eventAssignment.findFirst({
        where: {
          userId: thisUser.user.userId!,
          status: "ACTIVE",

          validFrom: {
            lt: totalSlots.validTo as Date,
          },
          validTo: {
            gt: totalSlots.validFrom as Date,
          },
        },
        select: { event: { select: { name: true } } },
      });

      if (overlappingAssignment) {
        return {
          success: false,
          message: `You have overlapping eventAssignment in Event: ${overlappingAssignment.event.name}`,
        };
      }

      // count active taken slots
      const takenSlots = await tx.availabilityEntry.count({
        where: {
          slotId: json.slotId,
          status: "ACTIVE",
        },
      });
      const availableToCreate = Number(totalSlots?.totalSlots) - takenSlots;

      if (availableToCreate <= 0) {
        return {
          success: false,
          message: "Slot is full",
        };
      }

      await tx.availabilityEntry.create({
        data: jsonWithCreator,
      });

      return {
        success: true,
      };
    });

    if (!creationResponse.success) {
      return NextResponse.json(
        { message: `${creationResponse.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "You Get Slot" }, { status: 201 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing" });
    }

    const json = (await req.json()) as z.infer<
      typeof DeleteAvailabilitySlotVolunteer
    >;

    const jsonWithCreator = {
      ...json,
      userId: thisUser.user.userId!,
    };

    const createResponse = await prisma.availabilityEntry.deleteMany({
      where: { userId: jsonWithCreator.userId, slotId: jsonWithCreator.slotId },
    });

    if (createResponse.count === 0) {
      return NextResponse.json({ message: "Deletion Failed" }, { status: 404 });
    }

    return NextResponse.json({ message: "Slot Canceled" }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

// This Must Move to Availability Slots [ID] File to apply
