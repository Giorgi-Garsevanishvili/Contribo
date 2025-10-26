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

type eventsRoleUpdateInput = {
  name: string;
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }

    const eventsRole = await prisma.eventsRole.findUnique({ where: { id } });

    if (!eventsRole) {
      return NextResponse.json(
        { message: `Events Role with id: ${id}, not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(eventsRole);
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
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const body = (await req.json()) as eventsRoleUpdateInput;

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "Fields must be provided" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { message: "name must be provided" },
        { status: 400 }
      );
    }

    const updatedEventsRole = await prisma.eventsRole.update({
      where: { id },
      data: body,
    });

    if (!updatedEventsRole) {
      return NextResponse.json(
        { message: "something went wrong" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Events Role Updated as: ${updatedEventsRole.name}` },
      { status: 200 }
    );
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
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const deletedEventsRole = await prisma.eventsRole.delete({ where: { id } });

    return NextResponse.json({
      message: `eventsRole: ${deletedEventsRole.name}, successfully deleted`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
