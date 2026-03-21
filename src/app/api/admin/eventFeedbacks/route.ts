import { FeedbackRequestStatus } from "@/generated/enums";
import { EventFeedbackWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const { searchParams } = new URL(req.url);

    const requestStatus = searchParams.get("status");
    const searchQuery = searchParams.get("search");

    const whereClause: EventFeedbackWhereInput = {
      event: { regionId: thisUser.user.ownAllowance?.regionId },
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
      orderBy: { requestedAt: "desc" },
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
