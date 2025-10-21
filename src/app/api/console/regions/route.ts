import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Prisma } from "@prisma/client";

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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
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
  } catch (error: any) {
    const message = error?.message || "Internal server error";
    const status = error?.status || 500;

    return NextResponse.json({ error: message }, { status });
  }
};
