import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { RatingCreate, UpdateRating } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" });
    }

    const data = await prisma.ratingHistory.findUnique({
      where: {
        id,
      },
      include: { user: { select: { name: true } } },
    });

    if (!data) {
      return NextResponse.json({
        message: `Rating History with ID:${id} not found!`,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message: message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json("Id is missing");
    }

    const json = (await req.json()) as z.infer<typeof UpdateRating>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = UpdateRating.parse(jsonWithCreator);

    await prisma.ratingHistory.update({ where: { id }, data: body });

    return NextResponse.json(
      { message: "Rating history Updated" },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = handleError(error);
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

    const deleted = await prisma.ratingHistory.delete({
      where: { id },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `Rating History record deleted`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
