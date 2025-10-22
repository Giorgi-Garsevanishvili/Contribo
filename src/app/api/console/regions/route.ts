import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Prisma } from "@prisma/client";
import { handleError } from "@/lib/errors/handleErrors";
type RegionData = Prisma.RegionCreateInput;

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const body = (await req.json()) as RegionData;

    if (!body || !Object.keys(body)) {
      return NextResponse.json(
        { message: "At least one field must be provided to create region" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { message: "Region name must be presented" },
        { status: 400 }
      );
    }

    const newRegion = await prisma.region.create({
      data: body,
    });

    return NextResponse.json(
      { message: `Region: ${newRegion.name}  Created`, data: newRegion },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const regions = await prisma.region.findMany();

    if (regions.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    return NextResponse.json(regions);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
