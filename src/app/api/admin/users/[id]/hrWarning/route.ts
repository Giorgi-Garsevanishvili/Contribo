import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { HrWarningCreate } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const json = (await req.json()) as z.infer<typeof HrWarningCreate>;
    const jsonWithCreator = {
      ...json,
      createdById: thisUser.user.id,
      assigneeId: id,
    };
    const body = HrWarningCreate.parse(jsonWithCreator);

    const response = await prisma.hrWarning.create({
      data: body,
      include: {
        type: { select: { name: true } },
        assignee: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: `HR Warning: ${response.type.name}, Created for: ${response.assignee.name}`,
      },
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing." }, { status: 400 });
    }

    const data = await prisma.hrWarning.findMany({
      where: {
        assigneeId: id,
        assignee: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
        },
      },
      select: {
        id: true,
        status: true,
        name: true,
        type: { select: { name: true } },
        assignee: { select: { name: true } },
      },
    });

    return NextResponse.json({data: data}, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
