import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AllowedUserUpdate } from "@/lib/zod";
import { Context } from "@/types/general-types";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const allowedUser = await prisma.allowedUser.findUnique({
      where: { id, regionId: thisUser.user.ownAllowance?.regionId },
      include: {
        roles: { include: { role: true } },
        region: { select: { id: true, name: true, status: true } },
        createdBy: { select: { name: true, id: true } },
        user: true,
      },
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

export const PUT = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }
    const json = await req.json();
    const jsonWithCreator = {
      ...json,
      creatorId: thisUser.user.id,
    };
    const body = AllowedUserUpdate.parse(jsonWithCreator);

    if (!body.roleId) {
      return NextResponse.json({
        message: "Role must be provided to update",
      });
    }

    if (body.regionId) {
      return NextResponse.json({
        message:
          "Admin is not allowed to modify region, please contact your console admin.",
      });
    }

    await prisma.userRole.deleteMany({ where: { userId: id } });

    if (body.roleId && body.roleId.length > 0) {
      await prisma.userRole.createMany({
        data: body.roleId.map((roleId) => ({ userId: id, roleId })),
      });
    } else {
      return NextResponse.json({ message: "Role is not provided" });
    }

    return NextResponse.json({
      message: `Allowed User, ${thisUser.user.name}, updated successfully`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const DELETE = async (req: NextRequest, context: Context) => {
  try {
    const session = await requireRole("ADMIN");
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
