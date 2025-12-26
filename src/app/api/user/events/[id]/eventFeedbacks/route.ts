import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateEventFeedback } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;
    const json = (await req.json()) as z.infer<typeof CreateEventFeedback>;
    const jsonWithCreator = {
      ...json,
      eventId: id,
      userId: thisUser.user.id,
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
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
