import "server-only";

import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

type Params = {
  params: {
    id: string;
  };
};

type SoftDelete = {
  name: string;
  email: string;
  image: null;
  roleId: null;
  deleted: boolean;
  deletedAt: Date;
  rating: number;
  reqStatus: string;
};

export const DELETE = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const userSoftData: SoftDelete = {
      name: "SoftUser",
      email: "SoftUser",
      image: null,
      roleId: null,
      deleted: true,
      deletedAt: new Date(),
      rating: 0,
      reqStatus: "PENDING",
    };

    await prisma.$transaction([
      prisma.allowedUser.delete({
        where: { email: user?.email },
      }),

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
