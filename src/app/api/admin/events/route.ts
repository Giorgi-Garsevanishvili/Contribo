import { EventWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateEvent } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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
    const { searchParams } = new URL(req.url);

    //pagination params with validation
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));

    const skip = (page - 1) * limit;

    // Search Params

    const assigneeFilter = searchParams.get("assignee");
    const searchQuery = searchParams.get("search");
    const fromDateFilter = searchParams.get("fromDate");
    const tillDateFilter = searchParams.get("tillDate");
    const statusFilter = searchParams.get("status");

    const whereClause: EventWhereInput = {
      regionId: thisUser.user.ownAllowance?.regionId,
    };

    if (assigneeFilter) {
      whereClause.OR = [
        { assignments: { some: { userId: assigneeFilter } } },
        {
          availabilities: {
            some: { availabilityEntries: { some: { userId: assigneeFilter } } },
          },
        },
      ];
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          name: { contains: searchQuery.trim(), mode: "insensitive" },
        },
        { description: { contains: searchQuery.trim(), mode: "insensitive" } },
      ];
    }

    if (fromDateFilter) {
      whereClause.startTime = {
        gte: new Date(fromDateFilter),
      };
    }

    if (tillDateFilter) {
      whereClause.endTime = {
        lte: new Date(tillDateFilter),
      };
    }

    if (statusFilter === "LIVE") {
      whereClause.startTime = { lte: new Date() };
      whereClause.endTime = { gte: new Date() };
    }

    if (statusFilter === "ENDED") {
      whereClause.endTime = { lt: new Date() };
    }

    if (statusFilter === "UPCOMING") {
      whereClause.startTime = { gt: new Date() };
    }

    const totalCount = await prisma.event.count({
      where: whereClause,
    });

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
            totalSlots: true,
          },
        },
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
        message: "Events not found!",
      });
    }

    const now = new Date();

    const dataWithStatus = data.map((event) => {
      let status: "UPCOMING" | "LIVE" | "ENDED";

      if (now < event.startTime) {
        status = "UPCOMING";
      } else if (now >= event.startTime && now <= event.endTime) {
        status = "LIVE";
      } else {
        status = "ENDED";
      }

      return {
        ...event,
        status,
      };
    });

    const response: ApiResponse = {
      data: dataWithStatus,
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

export const POST = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const json = (await req.json()) as z.infer<typeof CreateEvent>;
    const jsonWithCreator = {
      ...json,
      createdById: thisUser.user.id,
      regionId: thisUser.user.ownAllowance?.regionId,
    };
    const body = CreateEvent.parse(jsonWithCreator);

    if (Object.values(body).some((val) => val === "")) {
      return NextResponse.json(
        { message: "Empty Value Presented" },
        { status: 400 },
      );
    }

    const response = await prisma.event.create({
      data: body,
      include: {
        createdBy: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: `Event: ${response.name}, Created By: ${response.createdBy?.name}`,
        data: { name: response.name, id: response.id },
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const deleted = await prisma.event.deleteMany({
      where: {
        regionId: thisUser.user.ownAllowance?.regionId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Events deleted for region: ${thisUser.user.ownAllowance?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
