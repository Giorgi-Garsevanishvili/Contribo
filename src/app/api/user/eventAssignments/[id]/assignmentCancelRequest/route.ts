import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateAssignmentCancelReq } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" });
    }

    const json = (await req.json()) as z.infer<
      typeof CreateAssignmentCancelReq
    >;
    const jsonWithCreator = {
      ...json,
      assignmentId: id,
      requestedById: thisUser.user.id,
    };

    const body = CreateAssignmentCancelReq.parse(jsonWithCreator);

    const existedRequest = await prisma.assignmentCancelRequest.findMany({
      where: {
        OR: [{ status: "PENDING" }, { status: "REQUESTED" }],
        requestedById: thisUser.user.id,
        assignmentId: id,
      },
    });

    if (existedRequest.length >= 1) {
      return NextResponse.json(
        { message: "Cancel Request Already Exists" },
        { status: 409 },
      );
    }

    const response = await prisma.assignmentCancelRequest.create({
      data: body,
      select: {
        assignment: { select: { event: { select: { name: true } } } },
      },
    });

    return NextResponse.json(
      {
        message: `Created Assignment Cancel Request for Event: ${response.assignment.event.name}`,
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
