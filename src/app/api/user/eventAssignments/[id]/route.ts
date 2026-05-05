import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    const data = await prisma.eventAssignment.findUnique({
      where: {
        id,
        event: { regionId: thisUser.user?.regionId },
        userId: thisUser.user.userId || "",
      },
      include: {
        user: { select: { name: true, image: true } },
        createdBy: { select: { name: true, image: true } },
        updatedBy: { select: { name: true, image: true } },
        event: { select: { name: true } },
        role: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json({ data, message: "Assignments not found!" });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
