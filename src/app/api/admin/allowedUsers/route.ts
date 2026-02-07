import "server-only";
import { handleError } from "@/lib/errors/handleErrors";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { AllowedUserCreate } from "@/lib/zod";
import { Prisma } from "@/generated/client";

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const { searchParams } = new URL(req.url);

    const whereClause: Prisma.AllowedUserWhereInput = {
      regionId: thisUser.user.ownAllowance?.regionId,
    };

    //Pagination Params
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const totalCount = await prisma.allowedUser.count({
      where: whereClause
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const pagination = {
      totalCount,
      totalPages,
      hasNextPage,
      hasPrevPage,
      currentPage: page,
      limit,
    };

    //Search Params

    const regionFilter = searchParams.get("region")
    const searchQuery = searchParams.get("search")

    if(regionFilter){
      whereClause.regionId = regionFilter
    }

    if(searchQuery && searchQuery.trim()){
      whereClause.OR = [
        {user: {name: {contains: searchQuery.trim(), mode: "insensitive"}}}
      ]
    }


   

    const data = await prisma.allowedUser.findMany({
      where: whereClause,
      select: { id: true, email: true, user: { select: { name: true , ownAllowance:{select:{regionId:true}}} } },
      orderBy: {createdAt: "desc"},
      skip,
      take: limit,
    });

    if (!data || data.length === 0) {
      return NextResponse.json(
        { data, message: "Allowed users not found" },
        { status: 404 },
      );
    }

    const response = {
      data,
      pagination,
    };

    return NextResponse.json({ records: response }, { status: 200 });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("ADMIN");

    const json = (await req.json()) as z.infer<typeof AllowedUserCreate>;
    const jsonWithCreator = {
      ...json,
      creatorId: thisUser.user.id,
      regionId: thisUser.user.ownAllowance?.regionId,
    };
    const body = AllowedUserCreate.parse(jsonWithCreator);

    if (!body || !Object.keys(body).length) {
      return NextResponse.json(
        { message: "At least one filed must be provided" },
        { status: 400 },
      );
    }

    if (!body.email) {
      return NextResponse.json(
        { message: "Email and type field must be provided" },
        { status: 400 },
      );
    }

    const newAllowedUser = await prisma.allowedUser.create({
      data: {
        email: body.email,
        creatorId: thisUser.user.id,
      },
    });

    if (body.roleId && body.roleId.length > 0) {
      await prisma.userRole.createMany({
        data: body.roleId.map((roleId) => ({
          userId: newAllowedUser.id,
          roleId: roleId,
        })),
      });
    }

    if (!newAllowedUser) {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: `New Allowed User: ${newAllowedUser.email}, created successfully!`,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    return NextResponse.json({ error: message }, { status: status });
  }
};
