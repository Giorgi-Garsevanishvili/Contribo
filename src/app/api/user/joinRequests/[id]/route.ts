import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { updateJoinRequestRegular } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    const data = await prisma.joinRequest.findUnique({
      where: {
        id,
        createdById: thisUser.user.id,
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
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing!" });
    }

    const checkData = await prisma.joinRequest.findUnique({ where: { id } });

    if (
      checkData?.status === "PENDING" ||
      checkData?.status === "APPROVED" ||
      checkData?.status === "REJECTED"
    ) {
      return NextResponse.json({
        message: "Can`t Update Join Request Which Is In Progress or Resolved",
      });
    }

    const json = (await req.json()) as z.infer<typeof updateJoinRequestRegular>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = updateJoinRequestRegular.parse(jsonWithCreator);

    if (body.regionId === thisUser.user.ownAllowance?.regionId) {
      return NextResponse.json({
        message: "You Cant Request to Join Your Current Region",
      });
    }

    const response = await prisma.joinRequest.update({
      where: { id },
      data: body,
      select: { region: { select: { name: true } } },
    });

    return NextResponse.json(
      { message: `Join Request Updated to Region: ${response.region?.name}` },
      { status: 200 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    const deleted = await prisma.joinRequest.delete({
      where: {
        id,
        createdById: thisUser.user.id,
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
      message: `Join Request for region: ${deleted.region?.name} deleted! `,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
