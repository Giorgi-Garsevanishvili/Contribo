import { EventWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

type EventResponse = {
  id: string;
  name: string;
  updatedBy: {
    name: string | null;
  } | null;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
  } | null;
  startTime: Date;
  assignments: {
    user: {
      name: string | null;
    } | null;
  }[];
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
  data: EventResponse[];
  pagination: PaginationMeta;
};

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + 7);

    const whereClause: EventWhereInput = {
      regionId: thisUser.user.ownAllowance?.regionId,
      startTime: { gte: now, lte: future },
    };

    const data = await prisma.event.findMany({
      where: whereClause,
      select: {
        id: true,
        region: { select: { name: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        name: true,
        startTime: true,
        endTime: true,
        rating: true,
        location: true,
        assignments: {
          select: {
            role: { select: { name: true } },
            user: { select: { name: true, image: true } },
          },
        },
        availabilities: {
          select: {
            role: { select: { name: true } },
            availabilityEntries: {
              select: { user: { select: { name: true, image: true } } },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
    

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
        message: "Events not found!",
      });
    }

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
