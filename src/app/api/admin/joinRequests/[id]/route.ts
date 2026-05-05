import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { updateJoinRequest } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

class TransactionError extends Error {
  constructor(
    public message: string,
    public status: number,
  ) {
    super(message);
  }
}

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const data = await prisma.joinRequest.findUnique({
      where: {
        id,
        regionId: thisUser.user?.regionId,
      },
      include: {
        updatedBy: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json({ data, message: "Join Request not found!" });
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

    const checkData = await prisma.joinRequest.findUnique({ where: { id } });

    if (checkData?.status === "APPROVED" || checkData?.status === "REJECTED") {
      return NextResponse.json({
        message: "Can`t Update Join Request Which Is Resolved",
      });
    }

    const json = (await req.json()) as z.infer<typeof updateJoinRequest>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.userId,
    };

    const body = updateJoinRequest.parse(jsonWithCreator);

    const data = await prisma.$transaction(async (tx) => {
      const request = await tx.joinRequest.findUnique({
        where: { id },
        select: {
          status: true,
          regionId: true,
          createdBy: { select: { allowedUserId: true } },
        },
      });

      if (!request) {
        throw new TransactionError("Request Not Found", 500);
      }

      if (body.status === "APPROVED") {
        if (!request?.createdBy.allowedUserId) {
          throw new TransactionError("User Not Found", 500);
        }
        const updateUser = await tx.allowedUser.update({
          where: { id: request.createdBy.allowedUserId },
          data: { regionId: request.regionId },
        });

        if (!updateUser) {
          throw new TransactionError("Failed To Update User Region", 500);
        }
      }

      const updatedRequest = await tx.joinRequest.update({
        where: { id, regionId: thisUser.user?.regionId },
        data: body,
      });

      if (!updatedRequest) {
        throw new TransactionError("Failed To Update Request ", 500);
      }

      return { updatedRequest };
    });

    return NextResponse.json(
      { message: `Join Request Updated to ${data.updatedRequest.status}` },
      { status: 200 },
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

    const deleted = await prisma.joinRequest.delete({
      where: {
        id,
        regionId: thisUser.user?.regionId,
      },
      select: {
        createdBy: { select: { name: true } },
        region: { select: { name: true } },
      },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `Join Request for region: ${deleted.region?.name}, by: ${deleted.createdBy.name} deleted. `,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
