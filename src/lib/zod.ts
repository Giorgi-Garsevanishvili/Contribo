import { GTypes, RegionStatus, ReqStatus } from "@prisma/client";
import { z } from "zod";

export const SoftDelete = z
  .object({
    name: z.string(),
    email: z.email(),
    image: z.null().default(null),
    roleId: z.null().default(null),
    deleted: z.boolean().default(true),
    deletedAt: z.date().default(() => new Date()),
    rating: z.number().optional(),
    reqStatus: z.enum(ReqStatus).default(ReqStatus.PENDING),
  })
  .strict();

export const SoftDeleteInput = SoftDelete.partial({
  image: true,
  roleId: true,
  deleted: true,
  deletedAt: true,
  reqStatus: true,
});

export const UserUpdateInput = z
  .object({
    name: z.string().optional(),
    email: z.email().optional(),
    memberStatusId: z.string().optional(),
    positionId: z.string().optional(),
    regionId: z.string().optional(),
    roleId: z.string().optional(),
    deleted: z.boolean().optional(),
    reqStatus: z.enum(ReqStatus).optional(),
  })
  .strict();

export const RegionDataInput = z
  .object({
    name: z.string().toUpperCase(),
    logo: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
    status: z.enum(RegionStatus).optional(),
  })
  .strict();

export const RegionDataUpdate = RegionDataInput.partial({
  name: true,
});

// Allowed User Schema
export const AllowedUserCreate = z
  .object({
    email: z.email(),
    regionId: z.string().optional(),
    roleId: z.string().optional(),
    type: z.enum(GTypes).default(GTypes.SYSTEM),
    creatorId: z.string(),
  })
  .strict();

export const AllowedUserUpdate = AllowedUserCreate.omit({
  email: true,
  type: true,
}).partial();

//Schemas for: Position, Member status, hr warning and event roles.
export const DefaultSystemValuesCreate = z
  .object({
    name: z.string().toUpperCase(),
    type: z.enum(GTypes).default(GTypes.SYSTEM),
  })
  .strict();

  export const DefaultSystemValuesCreateAdmin = z
  .object({
    name: z.string().toUpperCase(),
    type: z.enum(GTypes).default(GTypes.REGION),
  })
  .strict();

export const DefaultSystemValuesUpdate = DefaultSystemValuesCreate.omit({
  type: true,
}).partial();
//-----------------------------------------------------------------

export type UserUpdateInput = z.infer<typeof UserUpdateInput>;
export type SoftDeleteType = z.infer<typeof SoftDelete>;
export type SoftDeleteInputType = z.infer<typeof SoftDeleteInput>;
export type RegionUpdateDataType = z.infer<typeof RegionDataUpdate>