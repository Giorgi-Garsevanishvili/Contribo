import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GTypes } from "@prisma/client";

type PositionCreateInput = {
  name: string;
  type: GTypes;
};

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const positions = await prisma.position.findMany();

    if (!positions || positions.length === 0) {
      return NextResponse.json(
        { message: "Positions not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(positions);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const body = (await req.json()) as PositionCreateInput;

    if (!body || !Object.keys(body)) {
      return NextResponse.json(
        { message: "At least one field must be provided" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { message: "Position name must be provided" },
        { status: 400 }
      );
    }

    const safeBody = {
      ...body,
      type: "SYSTEM" as GTypes,
    };

    const newPosition = await prisma.position.create({ data: safeBody });

    if (!newPosition) {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 400 }
      );
    }

    return NextResponse.json({message: `Position ${newPosition.name}, successfully created!`})
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
