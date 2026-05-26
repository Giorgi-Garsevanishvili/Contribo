import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserUpdateInput } from "@/lib/zod";
import { Context } from "@/types/general-types";
import { Prisma } from "@/generated/client";

export const GET = async (_req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const data = await prisma.user.findUnique({
      where: {
        id: thisUser.user.userId!,
        ownAllowance: { regionId: thisUser.user?.regionId },
      },
      select: {
        email: true,
        createdAt: true,
        providedFeedbacks: true,
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
          select: { action: true },
        },
        rating: true,
        image: true,
        name: true,
        _count: { select: { providedFeedbacks: true } },
        hrWarnings: {
          select: { type: { select: { name: true } }, status: true },
        },
        updatedAt: true,
        updatedBy: { select: { name: true } },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: `Something Went Wrong, User Not Found!` },
        { status: 404 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ message }, { status: status });
  }
};

// export const PUT = async (req: NextRequest, context: Context) => {
//   try {
//     const thisUser = await requireRole("ADMIN");
//     const { id } = await context.params;

//     if (!id) {
//       return NextResponse.json({ message: "Id is missing." }, { status: 300 });
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: {
//         id,
//         ownAllowance: { regionId: thisUser.user?.regionId },
//       },
//     });

//     if (!existingUser) {
//       return NextResponse.json(
//         { message: `user with id:${id} not found` },
//         { status: 404 },
//       );
//     }

//     const json = await req.json();
//     const body = { ...json, updatedById: thisUser.user.userId } as UserUpdateInput;

//     const bodyWithUpdater = UserUpdateInput.parse(body);

//     if (!body || !Object.keys(body).length) {
//       return NextResponse.json(
//         { message: "At least one field must be provided to update" },
//         { status: 400 },
//       );
//     }

//     const isChanged = Object.entries(body).some(([key, value]) => {
//       return existingUser[key as keyof typeof existingUser] !== value;
//     });

//     if (!isChanged) {
//       return NextResponse.json(
//         { message: `No Changes Detected, update skipped.` },
//         { status: 400 },
//       );
//     }

//     // await prisma.user.update({ where: { id }, data: body });

//     const data = await prisma.$transaction(async (tx) => {
//       let allowanceUpdate = {};
//       const emailChanged =
//         bodyWithUpdater.email && bodyWithUpdater.email !== existingUser.email;

//       if (bodyWithUpdater.email && existingUser.allowedUserId)
//         allowanceUpdate = await tx.allowedUser.update({
//           where: { id: existingUser.allowedUserId },
//           data: { email: bodyWithUpdater.email },
//           select: { email: true },
//         });

//       const userUpdate = await tx.user.update({
//         where: { id },
//         data: bodyWithUpdater,
//         select: { email: true, name: true },
//       });

//       if (emailChanged) {
//         await tx.account.deleteMany({ where: { userId: id } });
//       }

//       return { userUpdate, allowanceUpdate, emailChanged };
//     });

//     if (!data) {
//       return NextResponse.json(
//         { message: "User Update Failed!" },
//         { status: 500 },
//       );
//     }

//     const responseMessage = data.emailChanged
//       ? `User: ${existingUser.name}, updated successfully. User must sign in again with their new email.`
//       : `User: ${existingUser.name}, updated successfully.`;

//     // Check if the admin is updating their own email
//     if (existingUser.id === thisUser.user.userId && data.emailChanged) {
//       return NextResponse.json({
//         requiresSignOut: true,
//         message: "Your email has been updated. Please sign in again.",
//       });
//     }

//     return NextResponse.json({
//       message: responseMessage,
//     });
//   } catch (error) {
//     const { status, message } = handleError(error);
//     return NextResponse.json({ message }, { status: status });
//   }
// };
