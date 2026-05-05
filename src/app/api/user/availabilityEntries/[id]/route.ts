import { AvailabilityEntryWhereInput } from "@/generated/models";
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

    const whereClause: AvailabilityEntryWhereInput = {
      id,
      userId: thisUser.user.userId || "",
      slot: { event: { regionId: thisUser.user?.regionId } },
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

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          data,
          message: `Availability Entry Not Found for you with ID: ${id}`,
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
