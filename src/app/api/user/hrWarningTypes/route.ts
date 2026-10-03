import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { DefaultSystemValuesCreate } from "@/lib/zod";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("REGULAR");

    const data = await prisma.hrWarningType.findMany();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { data, message: "HR Warning Type not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status: status });
  }
};
