import { RatingAction } from "@/generated/enums";
import { RatingHistoryWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const { searchParams } = new URL(req.url);

    const actionFilter = searchParams.get("action");
    const searchQuery = searchParams.get("search");
    const monthLimitFilter = searchParams.get("monthLimit") === "true";

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const whereClause: RatingHistoryWhereInput = {
      userId: thisUser.user.userId!,
      regionId: thisUser.user.regionId,
    };

    if (monthLimitFilter) {
      whereClause.createdAt = {
        gte: startOfMonth,
        lt: startOfNextMonth,
      };
    }

    if (actionFilter) {
      whereClause.action = actionFilter as RatingAction;
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          reason: { contains: searchQuery.trim(), mode: "insensitive" },
        },
      ];
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const totalCount = await prisma.ratingHistory.count({ where: whereClause });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const pagination: PaginationMeta = {
      currentPage: page,
      totalCount,
      totalPages,
      limit,
      hasNextPage,
      hasPrevPage,
    };

    const data = await prisma.ratingHistory.findMany({
      where: whereClause,
      select: {
        updatedBy: { select: { name: true } },
        createdBy: { select: { name: true } },
        user: { select: { name: true } },
        action: true,
        createdAt: true,
        updatedAt: true,
        newValue: true,
        oldValue: true,
        value: true,
        reason: true,
        id: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    const response = {
      data,
      pagination,
    };

    if (!response.data || response.data.length === 0) {
      return NextResponse.json(
        {
          data,
          message: `Rating History for you in this region not found!`,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ records: response }, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message: message }, { status: status });
  }
};
