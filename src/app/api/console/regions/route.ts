import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { handleError } from "@/lib/errors/handleErrors";
import { RegionDataInput } from "@/lib/zod";

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const json = await req.json();
    const body = RegionDataInput.parse(json);

    if (!body || !Object.keys(body).length) {
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

    const data = await prisma.region.findMany();

    if (data.length === 0) {
      return NextResponse.json(
        { data, message: "No data found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
