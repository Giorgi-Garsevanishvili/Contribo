import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    id: string;
  };
};

type AllowedUserUpdate = {
  roleId: string;
  regionId: string;
  userId: string;
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const allowedUser = await prisma.allowedUser.findUnique({ where: { id } });

    if (!allowedUser) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    return NextResponse.json(allowedUser);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, { params }: Params) => {
  try {
    const thisUser = await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }
    const body = (await req.json()) as AllowedUserUpdate;

    if (!body || !Object.keys(body)) {
      return NextResponse.json({
        message: "At least one field must be provided",
      });
    }

    const safeBody = {
      ...body,
      userId: thisUser.user.id,
    };

    const updatedAllowedUser = await prisma.allowedUser.update({
      where: { id },
      data: safeBody,
    });

    if (!updatedAllowedUser) {
      return NextResponse.json(
        { message: "something went wrong!" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Allowed User with Email: ${updatedAllowedUser.email}, updated successfully`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const DELETE = async (req: NextRequest, { params }: Params) => {
  try {
    await requireRole("");
    const { id } = await params;
    const body = req.json();
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
