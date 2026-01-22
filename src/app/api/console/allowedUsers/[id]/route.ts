import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AllowedUserUpdate } from "@/lib/zod";
import { Context } from "@/types/general-types";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const data = await prisma.allowedUser.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        region: true,
        createdBy: true,
      },
    });

    if (!data) {
      return NextResponse.json(
        { data, message: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("QIRVEX");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }
    const json = await req.json();
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };
    const body = AllowedUserUpdate.parse(jsonWithCreator);

    if (!body.regionId && !body.roleId) {
      return NextResponse.json({
        message: "At least one field must be provided",
      });
    }

    await prisma.userRole.deleteMany({ where: { userId: id } });

    if (body.roleId && body.roleId.length > 0) {
      await prisma.userRole.createMany({
        data: body.roleId.map((roleId) => ({ userId: id, roleId })),
      });
    }

    const updatedAllowedUser = await prisma.allowedUser.update({
      where: { id },
      data: {
        regionId: body.regionId,
        updatedById:thisUser.user.id
      },
      include: { roles: { include: { role: true } } },
    });

    if (!updatedAllowedUser) {
      return NextResponse.json(
        { message: "something went wrong!" },
        { status: 400 }
      );
    }
    if (updatedAllowedUser.email === thisUser?.user.email) {
      return NextResponse.json({
        requiresSignOut: true,
        message: "Your permissions were revoked",
      });
    }

    return NextResponse.json({
      message: `Allowed User with Email: ${updatedAllowedUser.email}, updated successfully`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const DELETE = async (req: NextRequest, context: Context) => {
  try {
    const session = await requireRole("QIRVEX");
    const { id } = await context.params;

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

    if (deletedAllowedUser.email === session?.user.email) {
      return NextResponse.json({
        requiresSignOut: true,
        message: "Your permissions were revoked",
      });
    }

    return NextResponse.json({
      message: `Allowed user: ${deletedAllowedUser.email}, delete successfully!`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
