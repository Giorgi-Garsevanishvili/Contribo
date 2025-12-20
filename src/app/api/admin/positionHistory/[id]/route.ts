import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { PositionHistoryCreate, UpdatePositionHistory } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

//Depending on userId in params not history record id.
export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" });
    }

    const data = await prisma.positionHistory.findMany({
      where: {
        userId: id,
        user: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
        },
      },
      include: { user: { select: { name: true } } },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        message: `Position History for user with ID:${id} not found!`,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

//Depending on userId in params not history record id.
export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing!" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { positionHistories: { select: { ended: true } }, name: true },
    });

    const json = (await req.json()) as z.infer<typeof PositionHistoryCreate>;
    const jsonWithCreator = {
      ...json,
      userId: id,
      createdById: thisUser.user.id,
    };

    const body = PositionHistoryCreate.parse(jsonWithCreator);

    if (user?.positionHistories.some((p) => !p.ended) && !body.ended === true) {
      return NextResponse.json({
        message: "User can`t have more then one unended position history.",
      });
    }

    const res = await prisma.positionHistory.create({
      data: body,
      include: { position: { select: { name: true } } },
    });

    if (!res) {
      return NextResponse.json("Position creation failed!");
    }

    return NextResponse.json(
      {
        message: `New Position History Created for User: ${user?.name}, with position: ${res.position?.name}`,
      },
      { status: 201 }
    );
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

    const json = (await req.json()) as z.infer<typeof UpdatePositionHistory>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = UpdatePositionHistory.parse(jsonWithCreator);

    await prisma.positionHistory.update({
      where: { id, ended: false },
      data: body,
    });

    return NextResponse.json(
      { message: "Position history Updated" },
      { status: 200 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

//Depending on userId in params not history record id.
export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json("Id is missing");
    }
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: "User not found!" });
    }

    const deleted = await prisma.positionHistory.deleteMany({
      where: { userId: id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Position History records deleted for user: ${user?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
