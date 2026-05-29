import { ReqStatus } from "@/generated/enums";
import { JoinRequestWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateJoinRequest } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { searchParams } = new URL(req.url);

    const statusFilter = searchParams.get("status");

    const whereClause: JoinRequestWhereInput = {
      createdById: thisUser.user.userId || "",
    };

    if (statusFilter) {
      const statuses = statusFilter.split(",");

      whereClause.status = {
        in: statuses as ReqStatus[],
      };
    }

    const data = await prisma.joinRequest.findMany({
      where: whereClause,
      select: {
        id: true,
        createdBy: { select: { name: true, image: true } },
        region: { select: { name: true } },
        status: true,
        updatedAt: true,
        updatedBy: { select: { name: true } },
        requestedAt: true,
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
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
      createdById: thisUser.user.userId,
    };
    const body = CreateJoinRequest.parse(jsonWithCreator);

    if (body.regionId === thisUser.user?.regionId) {
      return NextResponse.json({
        message: "You Cant Request to Join Your Current Region",
      });
    }

    const statusFilter: ReqStatus[] = ["PENDING", "REQUESTED"];

    const checkData = await prisma.joinRequest.findMany({
      where: {
        createdById: thisUser.user.userId || "",
        regionId: body.regionId,
        status: { in: statusFilter },
      },
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
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const deleted = await prisma.joinRequest.deleteMany({
      where: {
        createdById: thisUser.user.userId || "",
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
