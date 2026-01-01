import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateRoleData = z
  .object({
    name: z.string().toUpperCase(),
  })
  .strict();

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const data = await prisma.role.findMany();

    if (data.length === 0) {
      return NextResponse.json(
        { data, message: "No Regions To display" },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const json = await req.json();
    const body = CreateRoleData.parse(json);

    if (!body || !Object.keys(body).length) {
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

    const role = await prisma.role.create({ data: body });

    return NextResponse.json(
      {
        message: `Role: ${role.name}, created successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
