import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GTypes } from "@prisma/client";

type memberStatusCreateInput = {
  name: string;
  type: GTypes;
};

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const memberStatuses = await prisma.memberStatus.findMany();

    if (!memberStatuses || memberStatuses.length === 0) {
      return NextResponse.json(
        { message: "Member status not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(memberStatuses);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const body = (await req.json()) as memberStatusCreateInput;

    if (!body || !Object.keys(body)) {
      return NextResponse.json(
        { message: "At least one field must be provided" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { message: "Member Status name must be provided" },
        { status: 400 }
      );
    }

    const safeBody = {
      ...body,
      type: "SYSTEM" as GTypes,
    };

    const newMemberStatus = await prisma.memberStatus.create({
      data: safeBody,
    });

    if (!newMemberStatus) {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Member Status ${newMemberStatus.name}, successfully created!`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
