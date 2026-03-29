import { NextRequest } from "next/server";

export const GET = async (_req: NextRequest) => {
  return;
};

/*
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { CreateAvailabilityEntry } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("REGULAR");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "id is missing" });
    }

    const json = (await req.json()) as z.infer<typeof CreateAvailabilityEntry>;

    const jsonWithCreator = {
      ...json,
      slotId: id,
    }
  } catch (error) {
    const { message, status } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};

*/

// This Must Move to Availability Slots [ID] File to apply
