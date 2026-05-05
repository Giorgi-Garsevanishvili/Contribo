import { AssignmentStatus } from "@/generated/enums";
import { AvailabilityEntryWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const { searchParams } = new URL(req.url);

    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("search");
    const roleFilter = searchParams.get("role");

    const whereClause: AvailabilityEntryWhereInput = {
      slot: { event: { regionId: thisUser.user?.regionId } },
    };

    if (statusFilter) {
      whereClause.status = statusFilter as AssignmentStatus;
    }

    if (roleFilter) {
      whereClause.slot = {
        event: { regionId: thisUser.user?.regionId },
        roleId: roleFilter,
      };
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          user: { name: { contains: searchQuery.trim(), mode: "insensitive" } },
        },
        {
          comment: { contains: searchQuery.trim(), mode: "insensitive" },
        },
        {
          slot: {
            event: {
              name: { contains: searchQuery.trim(), mode: "insensitive" },
            },
          },
        },
      ];
    }

    //Pagination Params
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const totalCount = await prisma.availabilityEntry.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const pagination = {
      totalCount,
      totalPages,
      hasNextPage,
      hasPrevPage,
      currentPage: page,
      limit,
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
      orderBy: { appliedAt: "desc" },
      skip,
      take: limit,
    });

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          data,
          message: `Availability Entries Not Found for Your Region`,
        },
        { status: 404 },
      );
    }

    const response = {
      data,
      pagination,
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

    const deleted = await prisma.availabilityEntry.deleteMany({
      where: {
        slot: {
          event: { regionId: thisUser.user?.regionId },
        },
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Availability Entry Deleted for all Events in region: ${thisUser.user?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
