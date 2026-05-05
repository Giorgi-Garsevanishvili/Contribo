import { ReqStatus } from "@/generated/enums";
import { AssignmentCancelRequestWhereInput } from "@/generated/models";
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

    // Search Params

    const assigneeFilter = searchParams.get("assignee");
    const searchQuery = searchParams.get("search");
    const statusFilter = searchParams.get("status");

    const whereClause: AssignmentCancelRequestWhereInput = {
      requestedBy: {
        ownAllowance: { regionId: thisUser.user?.regionId },
      },
    };

    if (assigneeFilter) {
      whereClause.OR = [{ assignmentId: assigneeFilter }];
    }

    if (statusFilter) {
      whereClause.status = statusFilter as ReqStatus;
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          reason: { contains: searchQuery.trim(), mode: "insensitive" },
        },
      ];
    }

    const totalCount = await prisma.assignmentCancelRequest.count({
      where: whereClause,
    });

    const data = await prisma.assignmentCancelRequest.findMany({
      where: whereClause,
      select: {
        id: true,
        assignment: {
          select: {
            user: { select: { name: true, image: true } },
            event: { select: { name: true } },
            status: true,
            comment: true,
          },
        },
        reason: true,
        status: true,
        requestedBy: { select: { name: true, image: true } },
        reviewedBy: { select: { name: true, image: true } },
        reviewedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    //Calculate Pagination metaData

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
        message: "Cancel Request not found!",
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

    const deleted = await prisma.assignmentCancelRequest.deleteMany({
      where: {
        requestedBy: {
          ownAllowance: { regionId: thisUser.user?.regionId },
        },
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All assignment Cancel Request deleted for region: ${thisUser.user?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
