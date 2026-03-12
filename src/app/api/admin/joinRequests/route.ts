import { Prisma } from "@/generated/client";
import { ReqStatus } from "@/generated/enums";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

type joinRequestResponse = {
  id: string;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
  };
  status: ReqStatus;
};

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type ApiResponse = {
  data: joinRequestResponse[];
  pagination: PaginationMeta;
};

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const { searchParams } = new URL(req.url);

    //pagination params with validation
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    //filter params

    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("search");

    const whereClause: Prisma.JoinRequestWhereInput = {
      regionId: thisUser.user.ownAllowance?.regionId,
    };

    if (
      statusFilter &&
      Object.values(ReqStatus).includes(statusFilter as ReqStatus)
    ) {
      whereClause.status = statusFilter as ReqStatus;
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          createdBy: {
            name: { contains: searchQuery.trim(), mode: "insensitive" },
          },
        },
      ];
    }

    //Pagination

    const totalCount = await prisma.joinRequest.count({
      where: whereClause,
    });

    const data = await prisma.joinRequest.findMany({
      where: whereClause,
      select: {
        id: true,
        createdBy: { select: { name: true, image: true } },
        region: { select: { name: true } },
        status: true,
        requestedAt: true,
      },
      orderBy: {
        requestedAt: "desc",
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
        message: "Join Request in your region not found!",
      });
    }

    const response: ApiResponse = {
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

    const deleted = await prisma.joinRequest.deleteMany({
      where: {
        regionId: thisUser.user.ownAllowance?.regionId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Join Requests deleted for region: ${thisUser.user.ownAllowance?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
