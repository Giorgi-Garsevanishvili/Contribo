import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReqStatus } from "@prisma/client";

type Params = {
  params: {
    id: string;
  };
};

type UserUpdateInput = {
  name?: string;
  email?: string;
  memberStatusId?: string;
  positionId?: string;
  regionId?: string;
  roleId?: string;
  deleted?: boolean;
  reqStatus?: ReqStatus;
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { message: `User with id: ${id}, not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing." }, { status: 300 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { message: `user with id:${id} not found` },
        { status: 404 }
      );
    }

    const body = (await req.json()) as UserUpdateInput;

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "At least one field must be provided to update" },
        { status: 400 }
      );
    }

    const isChanged = Object.entries(body).some(([key, value]) => {
      return existingUser[key as keyof typeof existingUser] !== value;
    });

    if (!isChanged) {
      return NextResponse.json(
        { message: `No Changes Detected, update skipped.` },
        { status: 400 }
      );
    }

    await prisma.user.update({ where: { id }, data: body });

    return NextResponse.json({
      message: `User: ${existingUser.name}, updated successfully.`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
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
      select: { email: true, deleted: true },
    });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    if (!user.deleted) {
      const deletedFromAllowedList = await prisma.allowedUser.delete({
        where: { email: user?.email },
      });

      if (!deletedFromAllowedList) {
        return NextResponse.json(
          { message: "User deletion failed!" },
          { status: 400 }
        );
      }
    }

    const deleted = await prisma.user.delete({ where: { id } });

    if (!deleted) {
      return NextResponse.json(
        { message: "something went wrong! user not deleted." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `user: ${deleted.name}, successfully deleted. `,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
