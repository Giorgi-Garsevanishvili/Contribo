import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { UpdateMemberStatusLog } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" });
    }

    const data = await prisma.memberStatusLog.findUnique({
      where: {
        id,
        user: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
        },
      },
      include: {
        user: { select: { name: true } },
        status: { select: { name: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json({
        data,
        message: `Member Status Log with ID:${id} not found!`,
      });
    }

    return NextResponse.json({ data }, { status: 200 });
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

    const json = (await req.json()) as z.infer<typeof UpdateMemberStatusLog>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = UpdateMemberStatusLog.parse(jsonWithCreator);

    await prisma.memberStatusLog.update({
      where: { id, ended: false },
      data: body,
    });

    return NextResponse.json(
      { message: "Member Status Log Updated" },
      { status: 200 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json("Id is missing");
    }

    const deleted = await prisma.memberStatusLog.delete({
      where: { id },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `Member Status Log deleted`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
