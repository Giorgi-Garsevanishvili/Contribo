import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const data = await prisma.memberStatusLog.findMany({
      where: {
        user: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
        },
      },
      select: {
        id: true,
        user: { select: { name: true } },
        ended: true,
        status: { select: { name: true } },
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({data,
        message: "Member Status Logs in your region not found!",
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

    const deleted = await prisma.memberStatusLog.deleteMany({
      where: {
        user: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
        },
      },
    });
    

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `All Member Status Logs deleted for region: ${thisUser.user.ownAllowance?.region?.name}!`,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
