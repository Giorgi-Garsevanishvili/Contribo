import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("ADMIN");

    const data = await prisma.position.findMany();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { data, message: "Positions not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
