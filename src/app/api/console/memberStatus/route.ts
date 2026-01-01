import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DefaultSystemValuesCreate } from "@/lib/zod";
import z from "zod";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const data = await prisma.memberStatus.findMany();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { data, message: "Member status not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("QIRVEX");

    const json = (await req.json()) as z.infer<
      typeof DefaultSystemValuesCreate
    >;
    const body = DefaultSystemValuesCreate.parse(json);

    if (!body || !Object.keys(body).length) {
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

    const newMemberStatus = await prisma.memberStatus.create({
      data: body,
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
