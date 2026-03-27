import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { CreateAvailabilitySlot } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextResponse, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" });
    }

    const json = (await req.json()) as z.infer<typeof CreateAvailabilitySlot>;
    const jsonWithCreator = {
      ...json,
      createdById: thisUser.user.id,
      eventId: id,
    };
    const body = CreateAvailabilitySlot.parse(jsonWithCreator);

    const response = await prisma.availabilitySlot.create({
      data: body,
      select: {
        event: { select: { name: true } },
        role: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: `Availability Slot Created For Event: ${response.event.name}, With Role: ${response.role.name}`,
      },
      { status: 201 },
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
