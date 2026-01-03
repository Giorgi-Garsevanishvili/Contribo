import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const data = await prisma.joinRequest.findMany({
      where: {
        regionId: thisUser.user.ownAllowance?.regionId,
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
        data,
        message: "Join Request in your region not found!",
      });
    }

    return NextResponse.json({data}, { status: 200 });
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
        regionId: thisUser.user.ownAllowance?.regionId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Join Requests deleted for region: ${thisUser.user.ownAllowance?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
