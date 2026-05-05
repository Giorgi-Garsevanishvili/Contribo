import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { UpdateAssignmentCancelReq } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" });
    }

    const data = await prisma.assignmentCancelRequest.findUnique({
      where: {
        id,
        assignment: {
          user: {
            ownAllowance: { regionId: thisUser.user?.regionId },
          },
        },
      },
      include: {
        assignment: {
          select: {
            user: { select: { name: true, image: true } },
            event: { select: { name: true } },
            status: true,
            comment: true,
          },
        },
        requestedBy: { select: { name: true, image: true } },
        reviewedBy: { select: { name: true, image: true } },
      },
    });

    if (!data) {
      return NextResponse.json({
        data,
        message: `Cancel Request with ID: ${id} not found!`,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const PUT = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing!" });
    }

    const reviewTime = new Date();

    const json = (await req.json()) as z.infer<
      typeof UpdateAssignmentCancelReq
    >;
    const jsonWithCreator = {
      ...json,
      reviewedById: thisUser.user.userId,
      reviewedAt: reviewTime,
    };

    const body = UpdateAssignmentCancelReq.parse(jsonWithCreator);

    if (body.status === "APPROVED") {
      await prisma.$transaction(async (tx) => {
        const updateAssignment = await tx.eventAssignment.update({
          where: { id: body.assignmentId },
          data: { updatedById: thisUser.user.userId, status: "CANCELLED" },
        });

        await tx.assignmentCancelRequest.update({
          where: { id },
          data: { ...body, status: "APPROVED" },
        });
        return updateAssignment;
      });

      return NextResponse.json(
        { message: "Assignment Cancel Request Approved" },
        { status: 200 },
      );
    } else {
      await prisma.assignmentCancelRequest.update({
        where: { id },
        data: body,
      });

      return NextResponse.json(
        { message: `Assignment Cancel Request Updated to: ${body.status}` },
        { status: 200 },
      );
    }
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
      return NextResponse.json({ message: "Id is missing" });
    }

    const deleted = await prisma.assignmentCancelRequest.delete({
      where: {
        id,
        assignment: {
          user: {
            ownAllowance: { regionId: thisUser.user?.regionId },
          },
        },
      },
      include: { assignment: { select: { user: { select: { name: true } } } } },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `Assignment Cancel Request, Requested By: ${deleted.assignment.user?.name} Deleted`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
