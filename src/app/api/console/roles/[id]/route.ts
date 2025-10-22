import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

type RoleUpdateData = {
  name: string;
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Cant find Id in params" },
        { status: 400 }
      );
    }

    const role = await prisma.role.findUnique({ where: { id } });

    if (!role) {
      return NextResponse.json(
        { message: `Role with id: ${id}, not found ` },
        { status: 404 }
      );
    }

    return NextResponse.json({ role }, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");

    const { id } = await params;

    const body = (await req.json()) as RoleUpdateData;

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

    const standardizedData: RoleUpdateData = {
      name: body.name.toUpperCase(),
    };

    const updatedRole = await prisma.role.update({
      where: { id },
      data: standardizedData,
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

export const DELETE = async (req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
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
