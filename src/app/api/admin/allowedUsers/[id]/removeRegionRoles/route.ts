import { handleError } from "@/lib/errors/handleErrors";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { Context } from "@/types/general-types";
import { NextRequest, NextResponse } from "next/server";

class TransactionError extends Error {
  constructor(
    public message: string,
    public status: number,
  ) {
    super(message);
  }
}

export const PUT = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing." }, { status: 400 });
    }

    const data = await prisma.$transaction(async (tx) => {
      const regularRole = await tx.role.findUnique({
        where: { name: "REGULAR" },
        select: { id: true },
      });

      if (!regularRole) {
        throw new TransactionError("Can't find Regular role", 404);
      }

      const deletedRoles = await tx.userRole.deleteMany({
        where: { userId: id },
      });

      if (deletedRoles.count === 0) {
        throw new TransactionError("User had no roles or deletion failed", 500);
      }

      const roleCreate = await tx.userRole.create({
        data: {
          userId: id,
          roleId: regularRole.id,
        },
      });

      if (!roleCreate) {
        throw new TransactionError("Failed to create role", 500);
      }

      const updatedUser = await tx.allowedUser.update({
        where: { id },
        data: {
          regionId: null,
          updatedById: thisUser.user.id,
        },
        select: {
          roles: { select: { role: { select: { name: true } } } },
          user: { select: { name: true } },
        },
      });

      if (!updatedUser) {
        throw new TransactionError("Failed To Update ", 500);
      }

      return { updatedUser };
    });

    return NextResponse.json({
      message: `Roles reset for ${data.updatedUser.user?.name}. Current role: ${data.updatedUser.roles.map((r) => r.role.name).join(", ")}`,
    });
  } catch (error) {
    if (error instanceof TransactionError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status });
  }
};
