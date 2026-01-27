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
        positionHistories: {
          where: { ended: false },
          select: {
            ended: true,
            createdAt: true,
            startedAt: true,
            position: { select: { name: true } },
            createdBy: { select: { name: true } },
          },
        },
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
    const body = { ...json, updatedById: thisUser.user.id } as UserUpdateInput;

    const bodyWithUpdater = UserUpdateInput.parse(body);

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

    // await prisma.user.update({ where: { id }, data: body });

    const data = await prisma.$transaction(async (tx) => {
      let allowanceUpdate = {};
      const emailChanged =
        bodyWithUpdater.email && bodyWithUpdater.email !== existingUser.email;

      if (bodyWithUpdater.email && existingUser.allowedUserId)
        allowanceUpdate = await tx.allowedUser.update({
          where: { id: existingUser.allowedUserId },
          data: { email: bodyWithUpdater.email },
          select: { email: true },
        });

      const userUpdate = await tx.user.update({
        where: { id },
        data: bodyWithUpdater,
        select: { email: true, name: true },
      });

      if (emailChanged) {
        await tx.account.deleteMany({ where: { userId: id } });
      }

      return { userUpdate, allowanceUpdate, emailChanged };
    });

    if (!data) {
      return NextResponse.json(
        { message: "User Update Failed!" },
        { status: 500 },
      );
    }

    const responseMessage = data.emailChanged
      ? `User: ${existingUser.name}, updated successfully. User must sign in again with their new email.`
      : `User: ${existingUser.name}, updated successfully.`;

    // Check if the admin is updating their own email
    if (existingUser.id === thisUser.user.id && data.emailChanged) {
      return NextResponse.json({
        requiresSignOut: true,
        message: "Your email has been updated. Please sign in again.",
      });
    }

    return NextResponse.json({
      message: responseMessage,
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
