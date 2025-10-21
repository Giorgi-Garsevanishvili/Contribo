import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type CreateRoleData = {
  name: string;
};

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const roles = await prisma.role.findMany();

    if (roles.length === 0) {
      return NextResponse.json(
        {
          message: "No Regions To display",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(roles);
  } catch (error: any) {
    const message = error?.message || "Internal server error";
    const status = error?.status || 500;

    return NextResponse.json({ error: message }, { status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const body = (await req.json()) as CreateRoleData;

    if (!body || !Object.keys(body)) {
      return NextResponse.json(
        { message: "field must be provided to create role" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { message: "name must be provided" },
        { status: 400 }
      );
    }

    const standardizedData: CreateRoleData = {
      name: body.name.toLocaleUpperCase(),
    };

    const role = await prisma.role.create({ data: standardizedData });

    return NextResponse.json({
      message: `Role: ${role.name}, created successfully`,
    });
  } catch (error: any) {
    const message = error?.message || "Internal server error";
    const status = error?.status || 500;

    return NextResponse.json({ error: message }, { status });
  }
};
