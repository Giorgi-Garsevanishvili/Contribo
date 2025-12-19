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

    const data = await prisma.ratingHistory.findMany({
      where: {
        id,
      },
      include: { user: { select: { name: true } } },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        message: `Rating History for user with ID:${id} not found!`,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message: message }, { status: status });
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

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: "User not found!" });
    }

    const json = (await req.json()) as z.infer<typeof RatingCreate>;

    const oldValue = user.rating;
    const newValue = json.newValue;
    const value =
      json.action === "DECREASE" ? oldValue - newValue : oldValue + newValue;

    const jsonWithCreator = {
      ...json,
      value,
      oldValue,
      newValue,
      userId: id,
      createdById: thisUser.user.id,
    };

    const body = RatingCreate.parse(jsonWithCreator);

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "At least one filed must be provided" },
        { status: 400 }
      );
    }

    const data = await prisma.$transaction(async (tx) => {
      const history = await tx.ratingHistory.create({ data: body });

      const user = await tx.user.update({
        where: { id },
        data: { rating: body.value },
        select: { name: true, rating: true },
      });

      // keep only last 30 records
      const oldRecords = await tx.ratingHistory.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        skip: 30,
        select: { id: true },
      });

      if (oldRecords.length > 0) {
        await tx.ratingHistory.deleteMany({
          where: {
            id: { in: oldRecords.map((r) => r.id) },
          },
        });
      }

      return { history, user };
    });

    if (!data) {
      return NextResponse.json("Rating creation failed!");
    }

    return NextResponse.json(
      {
        message: `User Rating history crated and current updated. User: ${user.name}, Rating: ${value}`,
      },
      { status: 201 }
    );
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

    const deleted = await prisma.ratingHistory.deleteMany({
      where: { userId: id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Rating History records deleted for user: ${user?.name}!`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
