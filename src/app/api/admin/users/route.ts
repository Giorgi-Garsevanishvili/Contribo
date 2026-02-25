import { UserWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

type UserResponse = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  rating: number;
  memberStatusLogs: {
    status: {
      name: string;
    } | null;
  }[];
  ownAllowance: {
    region: {
      name: string;
    } | null;
    roles: {
      role: {
        name: string;
      };
    }[];
  } | null;
}[];

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type ApiResponse = {
  data: UserResponse;
  pagination: PaginationMeta;
};

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const searchQuery = searchParams.get("search");
    const regionFilter = searchParams.get("filter");
    const roleFilter = searchParams.get("role");
    const membershipFilter = searchParams.get("membership");

    const whereClause: UserWhereInput = {
      ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
    };

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          name: { contains: searchQuery.trim(), mode: "insensitive" },
        },
        {
          email: { contains: searchQuery.trim(), mode: "insensitive" },
        },
      ];
    }

    if (regionFilter && whereClause.ownAllowance) {
      whereClause.ownAllowance.regionId = regionFilter;
    }

    if (roleFilter) {
      whereClause.ownAllowance = {
        roles: {
          some: { roleId: roleFilter },
        },
      };
    }

    if (membershipFilter) {
      whereClause.memberStatusLogs = {
        some: {
          memberStatusId: membershipFilter,
          ended: false,
        },
      };
    }

    const totalCount = await prisma.user.count({ where: whereClause });
    const data = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        rating: true,
        memberStatusLogs: {
          where: { ended: false },
          select: { status: { select: { name: true } } },
        },
        ownAllowance: {
          select: {
            region: { select: { name: true } },
            roles: { select: { role: { select: { name: true } } } },
          },
        },
      },
      orderBy: {
        name: "desc",
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
        message: "Users for your region not found!",
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
    const { status, message } = handleError(error);
    return NextResponse.json({ message: message }, { status: status });
  }
};
