import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { MemberStatusLogCreate } from "@/lib/zod";
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

    const data = await prisma.memberStatusLog.findMany({
      where: {
        userId: id,
        user: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
        },
      },
      select: {
        user: { select: { name: true } },
        status: { select: { name: true } },
        id: true,
        ended: true,
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        message: `Member Status Log for user with ID:${id} not found!`,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing!" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { memberStatusLogs: { select: { ended: true } }, name: true },
    });

    const json = (await req.json()) as z.infer<typeof MemberStatusLogCreate>;
    const jsonWithCreator = {
      ...json,
      userId: id,
      createdById: thisUser.user.id,
    };

    const body = MemberStatusLogCreate.parse(jsonWithCreator);

    if (user?.memberStatusLogs.some((p) => !p.ended) && !body.ended === true) {
      return NextResponse.json({
        message: "User can`t have more then one unended Member Status Log",
      });
    }

    const res = await prisma.memberStatusLog.create({
      data: body,
      include: { status: { select: { name: true } } },
    });

    if (!res) {
      return NextResponse.json("Member Status creation failed!");
    }

    return NextResponse.json(
      {
        message: `New Member Status Log Created for User: ${user?.name}, with Status: ${res.status?.name}`,
      },
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
