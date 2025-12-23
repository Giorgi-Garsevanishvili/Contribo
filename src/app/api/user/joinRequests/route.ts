import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateJoinRequest } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const data = await prisma.joinRequest.findMany({
      where: {
        createdById: thisUser.user.id,
      },
      select: {
        id: true,
        createdBy: { select: { name: true } },
        region: { select: { name: true } },
        status: true,
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        message: "Join Request for you not found!",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const json = (await req.json()) as z.infer<typeof CreateJoinRequest>;
    const jsonWithCreator = {
      ...json,
      createdById: thisUser.user.id,
    };
    const body = CreateJoinRequest.parse(jsonWithCreator);

    if (body.regionId === thisUser.user.ownAllowance?.regionId) {
      return NextResponse.json({
        message: "You Cant Request to Join Your Current Region",
      });
    }

    const checkData = await prisma.joinRequest.findMany({
      where: { createdById: thisUser.user.id, regionId: body.regionId },
    });

    if (checkData.length > 0) {
      return NextResponse.json({ message: "Similar Request already exists" });
    }

    const response = await prisma.joinRequest.create({
      data: body,
      include: {
        createdBy: { select: { name: true } },
        region: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: `Join Request Created for region: ${response.region?.name}`,
      },
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const deleted = await prisma.joinRequest.deleteMany({
      where: {
        createdById: thisUser.user.id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All of your join requests deleted!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
