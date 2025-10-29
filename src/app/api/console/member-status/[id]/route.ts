import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DefaultSystemValuesUpdate } from "@/lib/zod";
import z from "zod";

type Params = {
  params: {
    id: string;
  };
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }

    const memberStatus = await prisma.memberStatus.findUnique({
      where: { id },
    });

    if (!memberStatus) {
      return NextResponse.json(
        { message: `Member Status with id: ${id}, not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(memberStatus);
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
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const json = (await req.json()) as z.infer<
      typeof DefaultSystemValuesUpdate
    >;
    const body = DefaultSystemValuesUpdate.parse(json);

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "Fields must be provided" },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { message: "name must be provided" },
        { status: 400 }
      );
    }

    const updatedMemberStatus = await prisma.memberStatus.update({
      where: { id },
      data: body,
    });

    if (!updatedMemberStatus) {
      return NextResponse.json(
        { message: "something went wrong" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Member Status Updated as: ${updatedMemberStatus.name}` },
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
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const deletedMemberStatus = await prisma.memberStatus.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `Member Status: ${deletedMemberStatus.name}, successfully deleted`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
