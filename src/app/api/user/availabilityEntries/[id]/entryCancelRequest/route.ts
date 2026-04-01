import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateEntryCancelRequest } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing" });
    }

    const json = (await req.json()) as z.infer<typeof CreateEntryCancelRequest>;

    const jsonWithCreator = {
      ...json,
      entryId: id,
      requestedById: thisUser.user.id,
    };

    const body = CreateEntryCancelRequest.parse(jsonWithCreator);

    const response = await prisma.entryCancelRequest.create({
      data: body,
      include: {
        requestedBy: { select: { name: true } },
        entry: {
          select: { slot: { select: { event: { select: { name: true } } } } },
        },
      },
    });

    return NextResponse.json(
      {
        message: `Event Cancel Request Created For Event: ${response.entry.slot.event.name}`,
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
