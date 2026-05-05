import { FeedbackRequestStatus } from "@/generated/enums";
import { EventFeedbackWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateEventFeedback } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }
    const { searchParams } = new URL(req.url);

    const requestStatus = searchParams.get("status");
    const searchQuery = searchParams.get("search");

    const whereClause: EventFeedbackWhereInput = {
      eventId: id,
      event: { regionId: thisUser.user?.regionId },
    };

    //Pagination Params
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const totalCount = await prisma.eventFeedback.count({
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

    // search params

    if (requestStatus) {
      whereClause.requestStatus = requestStatus as FeedbackRequestStatus;
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          user: {
            email: { contains: searchQuery.trim(), mode: "insensitive" },
          },
        },
        {
          user: { name: { contains: searchQuery.trim(), mode: "insensitive" } },
        },
        {
          event: {
            name: { contains: searchQuery.trim(), mode: "insensitive" },
          },
        },
      ];
    }
    const data = await prisma.eventFeedback.findMany({
      where: whereClause,
      select: {
        user: { select: { name: true } },
        requestStatus: true,
        event: { select: { name: true } },
        eventId: true,
        userId: true,
        requestedAt: true,
        respondedAt: true,
        feedback: true,
      },
      orderBy: { requestedAt: "desc" },
      skip,
      take: limit,
    });

    if (!data) {
      return NextResponse.json(
        {
          data,
          message: `Feedback for event with id: ${id}, not found`,
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
    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status: status });
  }
};

export const POST = async (req: NextRequest, context: Context) => {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }

    const json = (await req.json()) as z.infer<typeof CreateEventFeedback>;

    const [eventAssignees, eventAvailabilities, feedbackData] =
      await Promise.all([
        prisma.eventAssignment.findMany({
          where: { eventId: id, status: "ACTIVE" },
          select: { userId: true },
        }),
        prisma.availabilityEntry.findMany({
          where: { slot: { eventId: id }, status: "ACTIVE" },
          select: { userId: true },
        }),
        prisma.eventFeedback.findMany({
          where: { eventId: id },
          select: { userId: true },
        }),
      ]);

    // Filter out nulls and get unique userIds
    const existedUserIds = new Set(
      feedbackData
        .map((r) => r.userId)
        .filter((id): id is string => id !== null), // Type guard
    );

    const allUserIds = new Set([
      ...eventAssignees
        .map((a) => a.userId)
        .filter((id): id is string => id !== null), // Type guard
      ...eventAvailabilities
        .map((a) => a.userId)
        .filter((id): id is string => id !== null), // Type guard
    ]);

    const newUserIds = Array.from(allUserIds).filter(
      (id) => !existedUserIds.has(id),
    );

    const data = await prisma.$transaction(async (tx) => {
      const created = [];

      for (const userId of newUserIds) {
        const body = CreateEventFeedback.parse({
          ...json,
          eventId: id,
          userId,
        });
        const request = await tx.eventFeedback.create({
          data: body,
          select: {
            id: true,
            userId: true,
            requestStatus: true,
          },
        });
        created.push(request);
      }

      return created;
    });

    return NextResponse.json(
      {
        message: `Created ${data.length} feedback requests`,
        count: data.length,
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is Missing" }, { status: 400 });
    }

    const deleted = await prisma.eventFeedback.deleteMany({
      where: {
        eventId: id,
        event: { regionId: thisUser.user?.regionId },
      },
    });

    if (!deleted || deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted" });
    }

    return NextResponse.json({
      message: `All Feedback deleted for this event!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
