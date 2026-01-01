import "server-only";

import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Context } from "@/types/general-types";

const RoleUpdateData = z
  .object({
    name: z.string().toUpperCase(),
  })
  .strict();

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    await requireRole("QIRVEX");

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Cant find Id in params" },
        { status: 400 }
      );
    }

    const data = await prisma.role.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { data, message: `Role with id: ${id}, not found ` },
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
    await requireRole("QIRVEX");

    const { id } = await context.params;

    const json = await req.json();
    const body = RoleUpdateData.parse(json);

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "At least one field must be provided to update." },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { message: "Name must be provided" },
        { status: 400 }
      );
    }

    const roleData = await prisma.role.findUnique({
      where: { id },
      select: { name: true },
    });

    const declinedDeletion = ["ADMIN", "QIRVEX", "REGULAR"];

    if (roleData && declinedDeletion.includes(roleData.name)) {
      return NextResponse.json(
        { message: "Default value declined to update" },
        { status: 500 }
      );
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      { message: `Role: ${updatedRole.name}, updated` },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const DELETE = async (req: NextRequest, context: Context) => {
  try {
    await requireRole("QIRVEX");

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const roleData = await prisma.role.findUnique({
      where: { id },
      select: { name: true },
    });

    const declinedDeletion = ["ADMIN", "QIRVEX", "REGULAR", "RESTRICT"];

    if (roleData && declinedDeletion.includes(roleData.name)) {
      return NextResponse.json(
        { message: "Default value declined to delete" },
        { status: 500 }
      );
    }

    const deleted = await prisma.role.delete({ where: { id } });

    return NextResponse.json(
      { message: `Role: ${deleted.name}, successfully deleted.` },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
