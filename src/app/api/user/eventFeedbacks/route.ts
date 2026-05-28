import { FeedbackRequestStatus } from "@/generated/enums";
import { EventFeedbackWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const { searchParams } = new URL(req.url);

    const requestStatus = searchParams.get("status");
    const searchQuery = searchParams.get("search");

    const whereClause: EventFeedbackWhereInput = {
      userId: thisUser.user.userId!,
      event: { regionId: thisUser.user?.regionId },
    };

    // search params

    if (requestStatus) {
      whereClause.requestStatus = requestStatus as FeedbackRequestStatus;
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        {
          event: {
            name: { contains: searchQuery.trim(), mode: "insensitive" },
          },
        },
      ];
    }

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

    const data = await prisma.eventFeedback.findMany({
      where: whereClause,
      select: {
        id: true,
        user: { select: { name: true } },
        requestStatus: true,
        event: { select: { name: true } },
        eventId: true,
        userId: true,
        requestedAt: true,
        respondedAt: true,
        responded: true,
        feedback: true,
        rating: true,
      },
      orderBy: { requestStatus: "asc" },
      skip,
      take: limit,
    });

    if (!data) {
      return NextResponse.json(
        {
          data,
          message: `Feedbacks Not Found for Your Region`,
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

export const DELETE = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const deleted = await prisma.eventFeedback.deleteMany({
      where: {
        userId: thisUser.user.userId,
        event: { regionId: thisUser.user?.regionId },
      },
    });

    if (!deleted || deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All feedBacks made by user deleted!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
