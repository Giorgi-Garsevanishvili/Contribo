import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const creationResponse = await prisma.$transaction(async (tx) => {
      const allUserIds = new Set<string>();
      const now = new Date();
      const event = await tx.event.findUnique({
        where: { id },
        select: {
          endTime: true,
          name: true,
          startTime: true,
          finalizedAt: true,
          assignments: {
            where: { status: "ACTIVE" },
            select: { userId: true, ratingScore: true, id: true },
          },
          availabilities: {
            select: {
              availabilityEntries: {
                where: { status: "ACTIVE" },
                select: { userId: true, ratingScore: true, id: true },
              },
            },
          },
        },
      });

      if (!event) {
        throw new Error("Event Not Found");
      }

      if (event.finalizedAt !== null) {
        return {
          success: false,
          message: "Event Already Finalized",
        };
      }

      if (now < event.startTime) {
        return {
          success: false,
          message: "Can`t Finalize Upcoming Event",
        };
      } else if (event.startTime <= now && now <= event.endTime) {
        return {
          success: false,
          message: "Can`t Finalize while Event is Live",
        };
      }

      // Assignment Scores
      for (const assignments of event.assignments) {
        if (!assignments.userId || !assignments.ratingScore) continue;

        allUserIds.add(assignments.userId);

        const user = await tx.user.findUnique({
          where: { id: assignments.userId },
          select: { rating: true },
        });

        if (!user) continue;

        const oldValue = user.rating;
        const newValue = oldValue + assignments.ratingScore;

        await tx.user.update({
          where: { id: assignments.userId },
          data: { rating: newValue },
        });

        await tx.ratingHistory.create({
          data: {
            userId: assignments.userId,
            oldValue,
            newValue,
            value: assignments.ratingScore,
            action: assignments.ratingScore >= 0 ? "INCREASE" : "DECREASE",
            reason: `Assignment Score from event: ${event.name}. SYSTEM`,
            createdById: thisUser.user.userId,
          },
        });

        await tx.eventAssignment.update({
          where: { id: assignments.id },
          data: { ratedAt: now },
        });
      }

      for (const slot of event.availabilities) {
        for (const entry of slot.availabilityEntries) {
          if (!entry.ratingScore) continue;

          allUserIds.add(entry.userId);

          const user = await tx.user.findUnique({
            where: { id: entry.userId },
            select: { rating: true },
          });

          if (!user) continue;

          const oldValue = user.rating;
          const newValue = oldValue + entry.ratingScore;

          await tx.user.update({
            where: { id: entry.userId },
            data: { rating: newValue },
          });

          await tx.ratingHistory.create({
            data: {
              userId: entry.userId,
              oldValue,
              newValue,
              value: entry.ratingScore,
              action: entry.ratingScore >= 0 ? "INCREASE" : "DECREASE",
              reason: `Availability score from event ${event.name}. SYSTEM`,
              createdById: thisUser.user.userId,
            },
          });

          await tx.availabilityEntry.update({
            where: { id: entry.id },
            data: { ratedAt: now },
          });
        }
      }

      const updatedEvent = await tx.event.update({
        where: { id },
        data: { finalizedAt: now },
        select: { endTime: true, startTime: true, name: true },
      });

      // Feedback Request

      const existingFeedback = await tx.eventFeedback.findMany({
        where: { eventId: id },
        select: { userId: true },
      });

      const existedUserSet = new Set(
        existingFeedback
          .map((f) => f.userId)
          .filter((u): u is string => u !== null),
      );

      const newFeedBackUsers = Array.from(allUserIds).filter(
        (u) => !existedUserSet.has(u),
      );

      if (newFeedBackUsers.length > 0) {
        await tx.eventFeedback.createMany({
          data: newFeedBackUsers.map((userId) => ({
            eventId: id,
            userId,
            rating: 25,
            requestedAt: new Date(),
          })),
          skipDuplicates: true,
        });
      }

      return {
        success: true,
        message: `Event: ${updatedEvent.name} Finalized`,
      };
    });

    if (!creationResponse.success) {
      return NextResponse.json(
        { message: `${creationResponse.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: `${creationResponse.message}`,
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
