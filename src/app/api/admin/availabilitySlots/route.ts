import { AvailabilitySlotWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const { searchParams } = new URL(req.url);

    //pagination params with validation
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));

    const skip = (page - 1) * limit;

    const whereClause: AvailabilitySlotWhereInput = {
      event: { regionId: thisUser.user?.regionId },
    };

    const responseData = await prisma.availabilitySlot.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const data = responseData.map((slot) => ({
      ...slot,
      totalCapacity: slot.totalSlots,
      activeCount: slot._count.availabilityEntries,
      available: slot.totalSlots - slot._count.availabilityEntries,
    }));

    const totalCount = await prisma.availabilitySlot.count({
      where: whereClause,
    });

    //Calculate Pagination metaData

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
        message: "Availability Slots not found!",
      });
    }

    const response = {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    };

    return NextResponse.json({ records: response }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const deleted = await prisma.availabilitySlot.deleteMany({
      where: {
        event: {
          regionId: thisUser.user?.regionId,
        },
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Availability Slots deleted for region: ${thisUser.user?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
