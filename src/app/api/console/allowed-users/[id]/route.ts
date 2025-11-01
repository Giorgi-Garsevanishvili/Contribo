import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AllowedUserUpdate } from "@/lib/zod";

type Params = {
  params: {
    id: string;
  };
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const allowedUser = await prisma.allowedUser.findUnique({
      where: { id },
      include: { role: true, region: true, createdBy: true },
    });

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
    const json = await req.json();
    const jsonWithCreator = {
      ...json,
      creatorId: thisUser.user.id,
    };
    const body = AllowedUserUpdate.parse(jsonWithCreator);

    if (!body.regionId && !body.roleId) {
      return NextResponse.json({
        message: "At least one field must be provided",
      });
    }

    const updatedAllowedUser = await prisma.allowedUser.update({
      where: { id },
      data: body,
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
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const deletedAllowedUser = await prisma.allowedUser.delete({
      where: { id },
    });

    if (!deletedAllowedUser) {
      return NextResponse.json(
        { message: "something went wrong!" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Allowed user: ${deletedAllowedUser.email}, delete successfully!`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
