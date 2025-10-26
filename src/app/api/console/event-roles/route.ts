import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GTypes } from "@prisma/client";

type eventsRoleCreateInput = {
  name: string;
  type: GTypes;
};

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const eventsRoles = await prisma.eventsRole.findMany();

    if (!eventsRoles || eventsRoles.length === 0) {
      return NextResponse.json(
        { message: "Events Roles not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(eventsRoles);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const body = (await req.json()) as eventsRoleCreateInput;

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "At least one field must be provided" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { message: "Events Role name must be provided" },
        { status: 400 }
      );
    }

    const safeBody = {
      ...body,
      type: "SYSTEM" as GTypes,
    };

    const newEventsRole = await prisma.eventsRole.create({ data: safeBody });

    if (!newEventsRole) {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Events Role ${newEventsRole.name}, successfully created!`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
