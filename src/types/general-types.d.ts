import { RegionUpdateDataType } from "@/lib/zod";
import { Position, Prisma } from "@prisma/client";

export type Context = {
  params: Promise<{ id: string }>;
};

export type AllowedUsersWithRelations = Prisma.AllowedUserGetPayload<{
  include: { role: true; region: true; createdBy: true };
}>;

export type GeneralDataWithRelations = Position;

export type UserDataUpdateType = {
  regionId: string;
  roleId: string;
};

export type GeneralDataUpdateType = {
  name: string;
};

export type RegionDataUpdateType = RegionUpdateDataType;

