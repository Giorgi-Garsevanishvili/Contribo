import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const data = await prisma.eventFeedback.findMany({
      where: { event: { regionId: thisUser.user.ownAllowance?.regionId } },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({data,
        message: "Event Feedbacks not found for you region!",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

