import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Context } from "@/types/general-types";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }

    const position = await prisma.position.findUnique({ where: { id } });

    if (!position) {
      return NextResponse.json(
        { message: `Position with id: ${id}, not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(position);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

