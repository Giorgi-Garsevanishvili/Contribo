import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const data = await prisma.user.findMany({
      where: {
        ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        rating: true,
        memberStatusLogs: {
          where: { ended: false },
          select: { status: { select: { name: true } } },
        },
        ownAllowance: {
          select: {
            region: { select: { name: true } },
            roles: { select: { role: { select: { name: true } } } },
          },
        },
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json({
        data,
        message: "Users for your region not found!",
      });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message: message }, { status: status });
  }
};
