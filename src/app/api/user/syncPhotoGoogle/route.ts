import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    const thisUser = await requireRole("REGULAR");

    if (!thisUser.user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findFirst({
      where: { userId: thisUser.user.userId, provider: "google" },
      select: { access_token: true },
    });

    if (!account?.access_token) {
      return NextResponse.json(
        { message: "No Google account linked" },
        { status: 400 },
      );
    }

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${account.access_token}` } },
    );

    if (!googleRes.ok) {
      return NextResponse.json(
        {
          message:
            "Failed to fetch Google profile. Try signing out and back in.",
        },
        { status: 400 },
      );
    }

    const profile = await googleRes.json();

    if (!profile.picture) {
      return NextResponse.json(
        {
          message: "No Photo Found",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: thisUser.user.userId },
      data: { image: profile.picture, updatedById: thisUser.user.userId },
    });

    return NextResponse.json(
      {
        message: `Image Successfully Synchronized`,
      },
      { status: 200 },
    );
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status: status });
  }
}
