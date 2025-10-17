"server only";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";
import { requireRole } from "@/lib/serverAuth";

type RegionData = {
  name: string;
  email?: string;
  phone?: string;
};

export const POST = async (req: NextRequest, data: RegionData) => {
  try {
    await requireRole("QIRVEX");

    const newRegion = await prisma.region.create({ data });

    return NextResponse.json(
      { message: "Region Created", data: newRegion },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof Error) {
      const status = (error as any).status || 500;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const regions = await prisma.region.findMany();

    if (!regions) {
      return NextResponse.json({ message: "No data found" });
    }

    return NextResponse.json(regions);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
