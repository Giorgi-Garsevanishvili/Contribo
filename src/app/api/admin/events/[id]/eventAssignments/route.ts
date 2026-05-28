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
        event: { regionId: thisUser.user?.regionId },
      },
      include: {
        user: { select: { name: true, image: true } },
        createdBy: { select: { name: true, image: true } },
        updatedBy: { select: { name: true, image: true } },
        event: { select: { name: true, finalizedAt: true } },
        role: { select: { name: true } },
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
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
      createdById: thisUser.user.userId,
      eventId: id,
    };
    const body = CreateEventAssignment.parse(jsonWithCreator);

    const creationResponse = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: json.eventId },
        select: {
          name: true,
          startTime: true,
          endTime: true,
          finalizedAt: true
        },
      });

      if (!event) {
        throw new Error("Slot Not Found");
      }

      // // prevent claim if Event Ended
      // const now = new Date();
      if (event.finalizedAt !== null) {
        return {
          success: false,
          message: "Event Already Finalized",
        };
      }

      // prevent duplicate same slot
      const existingSameSlot = await tx.eventAssignment.findFirst({
        where: {
          eventId: json.eventId,
          roleId: json.roleId,
          userId: json.userId,
          status: "ACTIVE",
        },
      });

      if (existingSameSlot) {
        return {
          success: false,
          message: "User Already Have Assignment For This Role",
        };
      }

      // Overlap Prevention
      const overlappingAvailability = await tx.availabilityEntry.findFirst({
        where: {
          userId: json.userId,
          status: "ACTIVE",
          slot: {
            validFrom: {
              lt: new Date(body.validTo as Date),
            },
            validTo: {
              gt: new Date(body.validTo as Date),
            },
          },
        },
        select: { slot: { select: { event: { select: { name: true } } } } },
      });

      if (overlappingAvailability) {
        return {
          success: false,
          message: `User have overlapping availability in Event: ${overlappingAvailability.slot.event.name}`,
        };
      }

      const overlappingAssignment = await tx.eventAssignment.findFirst({
        where: {
          userId: json.userId,
          status: "ACTIVE",

          validFrom: {
            lt: new Date(body.validTo as Date),
          },
          validTo: {
            gt: new Date(body.validFrom as Date),
          },
        },
        select: { event: { select: { name: true } } },
      });

      if (overlappingAssignment) {
        return {
          success: false,
          message: `User Have overlapping eventAssignment in Event: ${overlappingAssignment.event.name}`,
        };
      }

      const finalResponse = await tx.eventAssignment.create({
        data: jsonWithCreator,
        select: {
          user: { select: { name: true } },
          role: { select: { name: true } },
        },
      });

      return {
        success: true,
        message: `Assignment Created For ${finalResponse.user?.name} as ${finalResponse.role?.name}, In Event: ${event.name} `,
      };
    });

    if (!creationResponse.success) {
      return NextResponse.json(
        { message: `${creationResponse.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: `${creationResponse.message}`,
      },
      { status: 201 },
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

    if (!id) {
      return NextResponse.json({ message: "id is missing" });
    }

    const event = await prisma.event.findUnique({ where: { id } });

    const deleted = await prisma.eventAssignment.deleteMany({
      where: {
        eventId: id,
        event: { regionId: thisUser.user?.regionId },
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Event Assignments Deleted for Event: ${event?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
