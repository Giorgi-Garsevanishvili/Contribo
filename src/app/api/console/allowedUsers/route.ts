import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { AllowedUserCreate } from "@/lib/zod";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const data = await prisma.allowedUser.findMany({
      include: { roles: true, region: true, createdBy: true },
    });

    if (!data || data.length === 0) {
      return NextResponse.json(
        { data, message: "Allowed users not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("QIRVEX");

    const json = (await req.json()) as z.infer<typeof AllowedUserCreate>;
    const jsonWithCreator = { ...json, creatorId: thisUser.user.id };
    const body = AllowedUserCreate.parse(jsonWithCreator);

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

    const newAllowedUser = await prisma.allowedUser.create({
      data: {
        email: body.email,
        regionId: body.regionId,
        creatorId: thisUser.user.id,
      },
    });

    if (body.roleId && body.roleId.length > 0) {
      await prisma.userRole.createMany({
        data: body.roleId.map((roleId) => ({
          userId: newAllowedUser.id,
          roleId: roleId,
        })),
      });
    }

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
