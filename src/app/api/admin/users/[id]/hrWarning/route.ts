import {
  HrWarningWhereInput,
  HrWarningWhereUniqueInput,
} from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { HrWarningCreate } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

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
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const GET = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const { searchParams } = new URL(req.url);

    if (!id) {
      return NextResponse.json({ message: "Id is missing." }, { status: 400 });
    }

    const whereClause: HrWarningWhereInput = {
      assigneeId: id,
      assignee: {
        ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
      },
    };

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const totalCount = await prisma.hrWarning.count({ where: whereClause });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const pagination: PaginationMeta = {
      currentPage: page,
      totalCount,
      totalPages,
      limit,
      hasNextPage,
      hasPrevPage,
    };

    const data = await prisma.hrWarning.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        name: true,
        type: { select: { name: true } },
        assignee: { select: { name: true } },
        comment: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    const response = {
      data,
      pagination,
    };

    return NextResponse.json({ records: response }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    const deleted = await prisma.hrWarning.deleteMany({
      where: {
        assignee: {
          ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
          id
        },
      },
    });

    if (!deleted) {
      return NextResponse.json({ message: "Nothing Deleted!" });
    }

    return NextResponse.json({
      message: `${deleted.count} HR warnings, deleted. `,
    });
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
