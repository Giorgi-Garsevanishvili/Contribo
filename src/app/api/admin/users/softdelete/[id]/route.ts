import "server-only";

import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { SoftDelete, SoftDeleteInputType } from "@/lib/zod";
import { Context } from "@/types/general-types";

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, id: true, ownAllowance: true },
    });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const anonymizedIdentifier = `deleted_${id}_${Date.now()}`;
    const userSoftInput: SoftDeleteInputType = {
      name: anonymizedIdentifier,
      email: `${anonymizedIdentifier}@delete.com`,
    };

    const userSoftData = await SoftDelete.parseAsync(userSoftInput);

    await prisma.$transaction([
      prisma.allowedUser.update({
        where: { email: user?.email },
        data: { email: `${anonymizedIdentifier}@delete.com` },
      }),

      prisma.userRole.deleteMany({ where: { userId: user.ownAllowance?.id } }),

      prisma.account.deleteMany({ where: { userId: id } }),

      prisma.user.update({
        where: { id },
        data: { ...userSoftData },
      }),
    ]);

    return NextResponse.json({
      message: `user with email: ${user.email}, successfully soft-deleted. `,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
