import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserUpdateInput } from "@/lib/zod";
import { Context } from "@/types/general-types";

export const GET = async (_req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing" }, { status: 400 });
    }

    const data = await prisma.user.findUnique({
      where: {
        id,
        ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
      },
      include: {
        memberStatusLogs: {
          where: { ended: false },
          select: {
            createdAt: true,
            updatedAt: true,
            updatedBy: { select: { name: true } },
            createdBy: { select: { name: true } },
            status: { select: { name: true } },
          },
        },
        positionHistories: true,
        ratingHistory: {
          select: { id: true, newValue: true, value: true, action: true },
        },
        eventAssignments: true,
        providedFeedbacks: true,
        hrWarnings: true,
        ownAllowance: { select: { id: true } },
        CreatedAllowedUser: {
          select: { id: true, email: true, createdAt: true },
        },
        updatedBy: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: `User with id: ${id}, not found` },
        { status: 404 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const PUT = async (req: NextRequest, context: Context) => {
  try {
    const thisUser = await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing." }, { status: 300 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
        ownAllowance: { regionId: thisUser.user.ownAllowance?.regionId },
      },
    });
    if (!existingUser) {
      return NextResponse.json(
        { message: `user with id:${id} not found` },
        { status: 404 },
      );
    }

    const json = await req.json();
    const body = UserUpdateInput.parse(json);

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "At least one field must be provided to update" },
        { status: 400 },
      );
    }

    const isChanged = Object.entries(body).some(([key, value]) => {
      return existingUser[key as keyof typeof existingUser] !== value;
    });

    if (!isChanged) {
      return NextResponse.json(
        { message: `No Changes Detected, update skipped.` },
        { status: 400 },
      );
    }

    await prisma.user.update({ where: { id }, data: body });

    return NextResponse.json({
      message: `User: ${existingUser.name}, updated successfully.`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const DELETE = async (_req: NextRequest, context: Context) => {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Id is missing." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, deleted: true, allowedUserId: true },
    });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    //Based on DB schema if Allowed user table is deleted user table automatically deleting therefor Account table as well.

    if (!user.deleted) {
      if (user.allowedUserId) {
        // allowedUserId exists → delete by id
        const deletedFromAllowedList = await prisma.allowedUser.delete({
          where: { id: user.allowedUserId },
        });

        if (!deletedFromAllowedList) {
          return NextResponse.json(
            { message: "User deletion failed with AllowedUserID!" },
            { status: 400 },
          );
        }
      } else {
        // allowedUserId is NULL → fallback to delete by email
        const deletedFromAllowedList = await prisma.allowedUser.delete({
          where: { email: user.email },
        });

        if (!deletedFromAllowedList) {
          return NextResponse.json(
            { message: "User deletion failed with Email!" },
            { status: 400 },
          );
        }
      }
    }

    return NextResponse.json({
      message: `user: ${user.email}, successfully deleted. `,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
