import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("ADMIN");

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
