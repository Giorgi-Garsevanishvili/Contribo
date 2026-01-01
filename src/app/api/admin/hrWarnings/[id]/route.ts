import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { UpdateHrWarning } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const data = await prisma.hrWarning.findUnique({
      where: {
        id,
        assignee: {
          ownAllowance: {
            regionId: thisUser.user.ownAllowance?.regionId,
          },
        },
      },
      include: {
        assignee: { select: { name: true } },
        updatedBy: { select: { name: true } },
        createdBy: { select: { name: true } },
        type: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json({data,
        message: "HR Warning not found!",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const PUT = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing!" });
    }

    const json = (await req.json()) as z.infer<typeof UpdateHrWarning>;
    const jsonWithCreator = {
      ...json,
      updatedById: thisUser.user.id,
    };

    const body = UpdateHrWarning.parse(jsonWithCreator);

    await prisma.hrWarning.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      { message: "HR Warning Updated" },
      { status: 200 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const deleted = await prisma.hrWarning.delete({
      where: {
        id,
        assignee: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
        },
      },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `HR warning: ${deleted.name}, deleted. `,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
