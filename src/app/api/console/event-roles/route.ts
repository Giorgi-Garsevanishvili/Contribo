import "server-only"
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest) => {
  try {
    await requireRole("");
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await requireRole("");

    const body = req.json();
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
