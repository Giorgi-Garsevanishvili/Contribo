import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { updateJoinRequest } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const data = await prisma.joinRequest.findUnique({
      where: {
        id,
        regionId: thisUser.user.ownAllowance?.regionId,
      },
      include: {
        updatedBy: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json({
        message: "Join Request not found!",
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

    const checkData = await prisma.joinRequest.findUnique({ where: { id } });

    if (checkData?.status === "APPROVED" || checkData?.status === "REJECTED") {
      return NextResponse.json({
        message: "Can`t Update Join Request Which Is Resolved",
      });
    }

    const json = (await req.json()) as z.infer<typeof updateJoinRequest>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = updateJoinRequest.parse(jsonWithCreator);

    const response = await prisma.joinRequest.update({
      where: { id, regionId: thisUser.user.ownAllowance?.regionId },
      data: body,
    });

    return NextResponse.json(
      { message: `Join Request Updated to ${response.status}` },
      { status: 200 }
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
        regionId: thisUser.user.ownAllowance?.regionId,
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
