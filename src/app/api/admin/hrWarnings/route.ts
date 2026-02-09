import { HrWarningStatus, Prisma } from "@/generated/client";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

type HrWarningResponse = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  updatedBy: {
    name: string | null;
  } | null;
  type: {
    id: string;
    name: string;
  };
  createdBy: {
    name: string | null;
  } | null;
  comment: string | null;
  status: HrWarningStatus;
  assignee: {
    name: string | null;
  };
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
  data: HrWarningResponse[];
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
    const typeFilter = searchParams.get("type");
    const searchQuery = searchParams.get("search");

    //Where clause build

    const whereClause: Prisma.HrWarningWhereInput = {
      assignee: {
        ownAllowance: {
          regionId: thisUser.user.ownAllowance?.regionId,
        },
      },
    };

    if (
      statusFilter &&
      Object.values(HrWarningStatus).includes(statusFilter as HrWarningStatus)
    ) {
      whereClause.status = statusFilter as HrWarningStatus;
    }

    if (typeFilter) {
      whereClause.typeId = typeFilter;
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          assignee: {
            name: { contains: searchQuery.trim(), mode: "insensitive" },
          },
        },
        { comment: { contains: searchQuery.trim(), mode: "insensitive" } },
      ];
    }

    //Pagination

    const totalCount = await prisma.hrWarning.count({ where: whereClause });

    const data = await prisma.hrWarning.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        name: true,
        type: { select: { name: true, id: true } },
        assignee: { select: { name: true } },
        comment: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
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
        message: "HR Warnings in your region not found!",
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

    const deleted = await prisma.hrWarning.deleteMany({
      where: {
        assignee: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
        },
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All HR Warning records deleted for region: ${thisUser.user.ownAllowance?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
