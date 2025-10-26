import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    id: string;
  };
};

type hrWarningTypeUpdateInput = {
  name: string;
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("QIRVEX");
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing!" }, { status: 400 });
    }

    const hrWarningType = await prisma.hrWarningType.findUnique({
      where: { id },
    });

    if (!hrWarningType) {
      return NextResponse.json(
        { message: `HR Warning Type with id: ${id}, not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(hrWarningType);
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

    const body = (await req.json()) as hrWarningTypeUpdateInput;

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

    const updatedHrWarningType = await prisma.hrWarningType.update({
      where: { id },
      data: body,
    });

    if (!updatedHrWarningType) {
      return NextResponse.json(
        { message: "something went wrong" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `HR Warning Type Updated as: ${updatedHrWarningType.name}` },
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

    const deletedHrWarningType = await prisma.hrWarningType.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `HR Warning Type: ${deletedHrWarningType.name}, successfully deleted`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
