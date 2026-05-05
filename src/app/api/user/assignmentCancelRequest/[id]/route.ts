import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" });
    }

    const data = await prisma.assignmentCancelRequest.findUnique({
      where: {
        id,
        assignment: {
          userId: thisUser.user.userId,
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

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    const data = await prisma.assignmentCancelRequest.findUnique({
      where: { id, assignment: { userId: thisUser.user.userId } },
    });

    if (data?.status === "APPROVED" || data?.status === "REJECTED") {
      return NextResponse.json({
        message: `Delete Request Aborted because of Status: ${data.status}`,
      });
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
