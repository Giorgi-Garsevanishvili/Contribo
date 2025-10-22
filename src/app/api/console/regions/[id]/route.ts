import "server-only";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors/handleErrors";

type Params = {
  params: {
    id: string;
  };
};

type UpdateRegionPayload = Prisma.RegionUpdateInput;

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Region ID is missing" },
        { status: 400 }
      );
    }

    const region = await prisma.region.findUnique({
      where: { id },
    });

    if (!region) {
      return NextResponse.json(
        { message: `Region with id: ${id}, not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(region);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Region ID is missing" },
        { status: 400 }
      );
    }

    const body = (await req.json()) as UpdateRegionPayload;

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "At least one field must be provided to update." },
        { status: 400 }
      );
    }

    const existingRegion = await prisma.region.findUnique({ where: { id } });
    if (!existingRegion) {
      return NextResponse.json(
        { message: `Region with id: ${id}, not found.` },
        { status: 404 }
      );
    }

    const disallowedKeys = ["id", "createdAt", "updatedAt"];
    const safeBody = Object.fromEntries(
      Object.entries(body).filter(([key]) => !disallowedKeys.includes(key))
    );

    const isChanged = Object.entries(safeBody).some(([key, value]) => {
      return existingRegion[key as keyof typeof existingRegion] !== value;
    });

    if (!isChanged) {
      return NextResponse.json(
        { message: `No Changes Detected, update skipped.` },
        { status: 400 }
      );
    }

    const region = await prisma.region.update({
      where: { id },
      data: safeBody,
    });

    return NextResponse.json(
      { message: `Region: ${region.name} updated successfully`, data: region },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const DELETE = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Region ID is missing" },
        { status: 400 }
      );
    }

    const deletedRegion = await prisma.region.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: `Region: ${deletedRegion.name}, deleted successfully`,
        data: deletedRegion,
      },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
