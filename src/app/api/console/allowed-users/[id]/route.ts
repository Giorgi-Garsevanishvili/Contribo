import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    await requireRole("");
    const { id } = await params;
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, { params }: Params) => {
  try {
    await requireRole("");
    const { id } = await params;
    const body = req.json();
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const DELETE = async (req: NextRequest, { params }: Params) => {
  try {
    await requireRole("");
    const { id } = await params;
    const body = req.json();
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
