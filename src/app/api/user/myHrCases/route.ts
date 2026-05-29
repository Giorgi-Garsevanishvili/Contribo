import { Prisma } from "@/generated/client";
import { HrWarningStatus } from "@/generated/enums";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
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
    const thisUser = await requireRole("REGULAR");

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

    const monthLimitFilter = searchParams.get("monthLimit") === "true";

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    //Where clause build

    const whereClause: Prisma.HrWarningWhereInput = {
      assignee: {
        id: thisUser.user.userId!,
        ownAllowance: {
          regionId: thisUser.user?.regionId,
        },
      },
      regionId: thisUser.user.regionId,
    };

    if (monthLimitFilter) {
      whereClause.createdAt = {
        gte: startOfMonth,
        lt: startOfNextMonth,
      };
    }

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
        message: "HR Warnings for you, in this region not found!",
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
