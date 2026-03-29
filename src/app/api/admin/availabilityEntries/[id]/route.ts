import { AvailabilityEntryWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { UpdateAvailabilityEntryAdmin } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" });
    }

    const whereClause: AvailabilityEntryWhereInput = {
      id,
      slot: { event: { regionId: thisUser.user.ownAllowance?.regionId } },
    };

    const data = await prisma.availabilityEntry.findMany({
      where: whereClause,
      include: {
        slot: {
          select: {
            role: { select: { name: true } },
            event: { select: { name: true } },
            ratingScore: true,
            published: true,
          },
        },
        user: { select: { name: true, image: true } },
        updatedBy: { select: { name: true, image: true } },
      },
    });

    if (!data) {
      return NextResponse.json(
        {
          data,
          message: `Availability Entry Not Found with ID${id} `,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
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
      return NextResponse.json({ message: "Id is missing" });
    }

    const json = (await req.json()) as z.infer<
      typeof UpdateAvailabilityEntryAdmin
    >;

    const jsonWithCreator = {
      ...json,
      updatedByID: thisUser.user.id,
    };

    const body = UpdateAvailabilityEntryAdmin.parse(jsonWithCreator);

    const data = await prisma.availabilityEntry.update({
      where: {
        id,
        slot: { event: { regionId: thisUser.user.ownAllowance?.regionId } },
      },
      data: body,
      include: { slot: { select: { event: { select: { name: true } } } } },
    });

    return NextResponse.json(
      {
        message: `Availability Entry Updated For Event: ${data.slot.event.name}`,
      },
      { status: 200 },
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

    const deleted = await prisma.availabilityEntry.delete({
      where: {
        id,
        slot: { event: { regionId: thisUser.user.ownAllowance?.regionId } },
      },
      select: { slot: { select: { event: { select: { name: true } } } } },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `Availability Entry Deleted For Event: ${deleted.slot.event.name}`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
