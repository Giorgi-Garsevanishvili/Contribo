import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GTypes } from "@prisma/client";

type allowedUserCreate = {
  email: string;
  regionId?: string;
  roleId?: string;
  userId?: string;
  type?: GTypes;
};

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const allowedUsers = await prisma.allowedUser.findMany();

    if (!allowedUsers || allowedUsers.length === 0) {
      return NextResponse.json(
        { message: "Allowed users not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(allowedUsers);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("QIRVEX");

    const body = (await req.json()) as allowedUserCreate;

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "At least one filed must be provided" },
        { status: 400 }
      );
    }

    if (!body.email) {
      return NextResponse.json(
        { message: "Email and type field must be provided" },
        { status: 400 }
      );
    }

    const safeBody = {
      ...body,
      type: GTypes.SYSTEM,
      creatorId: thisUser.user.id,
    };

    const newAllowedUser = await prisma.allowedUser.create({ data: safeBody });

    if (!newAllowedUser) {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `New Allowed User: ${newAllowedUser.email}, created successfully!`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
