import { AssignmentStatus } from "@/generated/enums";
import { EventAssignmentWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const { searchParams } = new URL(req.url);

    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("search");

    const whereClause: EventAssignmentWhereInput = {
      event: { regionId: thisUser.user?.regionId },
      userId: thisUser.user.userId || "",
    };

    // search params

    if (statusFilter) {
      whereClause.status = statusFilter as AssignmentStatus;
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          event: {
            name: { contains: searchQuery.trim(), mode: "insensitive" },
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

    const totalCount = await prisma.eventAssignment.count({
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

    const data = await prisma.eventAssignment.findMany({
      where: whereClause,
      select: {
        id: true,
        user: { select: { name: true, image: true } },
        createdBy: { select: { name: true, image: true } },
        updatedBy: { select: { name: true, image: true } },
        event: { select: { name: true } },
        role: { select: { name: true } },
        status: true,
        comment: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    if (!data) {
      return NextResponse.json(
        {
          data,
          message: `Event Assignments Not Found for You`,
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
