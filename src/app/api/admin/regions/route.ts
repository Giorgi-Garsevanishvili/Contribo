import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { handleError } from "@/lib/errors/handleErrors";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("ADMIN");

    const data = await prisma.region.findMany({
      select: { name: true, id: true, createdAt: true, updatedAt: true },
    });

    if (data.length === 0) {
      return NextResponse.json(
        { data, message: "No data found" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status: status });
  }
};
