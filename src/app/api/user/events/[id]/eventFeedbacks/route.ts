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
    const thisUser = await requireRole("REGULAR");
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
        id:true,
        responded:true,
        rating:true,
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
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;
    const json = (await req.json()) as z.infer<typeof CreateEventFeedback>;
    const jsonWithCreator = {
      ...json,
      eventId: id,
      userId: thisUser.user.userId,
    };
    const body = CreateEventFeedback.parse(jsonWithCreator);

    const result = await prisma.$transaction(async (tx) => {
      const feedback = await tx.eventFeedback.create({
        data: body,
        include: {
          user: { select: { name: true } },
          event: { select: { name: true } },
        },
      });

      const ratingRaw = await tx.eventFeedback.findMany({
        where: { eventId: id },
        select: { rating: true },
      });

      const rating = ratingRaw
        .map((r) => r.rating)
        .filter((r): r is number => r !== null);

      const avg = rating.reduce((a, b) => a + b, 0) / (rating.length || 1);

      await tx.event.update({
        where: { id },
        data: { rating: avg },
      });

      return { feedback, avg };
    });

    return NextResponse.json(
      {
        message: `Feedback Created for Event: ${result.feedback.event?.name}, Average Rating: ${result.avg}`,
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
