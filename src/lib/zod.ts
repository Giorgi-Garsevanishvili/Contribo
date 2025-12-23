import {
  GTypes,
  HrWarningStatus,
  RatingAction,
  RegionStatus,
  ReqStatus,
} from "@prisma/client";
import { z } from "zod";

export const SoftDelete = z
  .object({
    name: z.string(),
    email: z.email(),
    image: z.null().default(null),
    deleted: z.boolean().default(true),
    deletedAt: z.date().default(() => new Date()),
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
    roleId: z.array(z.string()).optional(),
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

// Schemas for RatingHistory
//-----------------------------------------------------------------
export const RatingCreate = z
  .object({
    value: z.int(),
    oldValue: z.int(),
    newValue: z.int(),
    userId: z.string(),
    action: z.enum(RatingAction),
    reason: z.string().optional(),
    createdById: z.string(),
  })
  .strict();

export const UpdateRating = z
  .object({
    reason: z.string(),
    updatedById: z.string(),
  })
  .strict();
//-----------------------------------------------------------------

// Schemas for Position History
//-----------------------------------------------------------------
export const PositionHistoryCreate = z
  .object({
    userId: z.string(),
    positionId: z.string(),
    startedAt: z.coerce.date().default(() => new Date()),
    endedAt: z.coerce.date().optional().nullable(),
    ended: z.boolean().optional(),
    createdById: z.string(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.endedAt && data.endedAt < data.startedAt) {
      ctx.addIssue({
        path: ["endedAt"],
        message: "End date cannot be earlier than start date",
        code: "custom",
      });
    }

    if (data.ended && !data.endedAt) {
      ctx.addIssue({
        path: ["endedAt"],
        message: "End date is required when position is marked as ended",
        code: "custom",
      });
    }
  });

export const UpdatePositionHistory = z
  .object({
    startedAt: z.coerce.date().optional(),
    endedAt: z.coerce.date().optional().nullable(),
    ended: z.boolean().optional(),
    updatedById: z.string(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.startedAt && data.endedAt && data.endedAt < data.startedAt) {
      ctx.addIssue({
        path: ["endedAt"],
        message: "End date cannot be earlier than start date",
        code: "custom",
      });
    }

    if (data.ended === true && !data.endedAt) {
      ctx.addIssue({
        path: ["endedAt"],
        message: "End date is required when marking as ended",
        code: "custom",
      });
    }
  });
//------------------------------------------------------------
//
// Schemas for HR Warnings
//-----------------------------------------------------------------
export const HrWarningCreate = z
  .object({
    name: z.string(),
    typeId: z.string(),
    assigneeId: z.string(),
    comment: z.string().optional(),
    status: z.enum(HrWarningStatus).default("ACTIVE"),
    createdById: z.string(),
  })
  .strict();

export const UpdateHrWarning = z
  .object({
    name: z.string().optional(),
    typeId: z.string().optional(),
    comment: z.string().optional(),
    status: z.enum(HrWarningStatus).optional(),
    updatedById: z.string(),
  })
  .strict();
//-----------------------------------------------------------------

//------------------------------------------------------------
//
// Schemas for Member Status Log
//-----------------------------------------------------------------
export const MemberStatusLogCreate = z
  .object({
    userId: z.string(),
    memberStatusId: z.string(),
    startedAt: z.coerce.date().default(() => new Date()),
    endedAt: z.coerce.date().optional().nullable(),
    ended: z.boolean().optional(),
    createdById: z.string(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.endedAt && data.endedAt < data.startedAt) {
      ctx.addIssue({
        path: ["endedAt"],
        message: "End date cannot be earlier than start date",
        code: "custom",
      });
    }

    if (data.ended && !data.endedAt) {
      ctx.addIssue({
        path: ["endedAt"],
        message: "End date is required when status log is marked as ended",
        code: "custom",
      });
    }
  });

export const UpdateMemberStatusLog = z
  .object({
    startedAt: z.coerce.date().optional(),
    endedAt: z.coerce.date().optional().nullable(),
    ended: z.boolean().optional(),
    updatedById: z.string(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.startedAt && data.endedAt && data.endedAt < data.startedAt) {
      ctx.addIssue({
        path: ["endedAt"],
        message: "End date cannot be earlier than start date",
        code: "custom",
      });
    }

    if (data.ended === true && !data.endedAt) {
      ctx.addIssue({
        path: ["endedAt"],
        message: "End date is required when marking as ended",
        code: "custom",
      });
    }
  });
//-----------------------------------------------------------------

//
// Schemas for Join Request
//-----------------------------------------------------------------

export const updateJoinRequest = z
  .object({
    updatedById: z.string(),
    status: z.enum(ReqStatus).default("REQUESTED"),
  })
  .strict();

//-----------------------------------------------------------------
//
// Schemas for Join Request For REGULAR access (For user endpoints)
//------------------------------------------------------
export const CreateJoinRequest = z
  .object({
    createdById: z.string(),
    regionId: z.string(),
  })
  .strict();

export const updateJoinRequestRegular = z
  .object({
    updatedById: z.string(),
    regionId: z.string(),
  })
  .strict();
//------------------------------------------------------

export type UserUpdateInput = z.infer<typeof UserUpdateInput>;
export type SoftDeleteType = z.infer<typeof SoftDelete>;
export type SoftDeleteInputType = z.infer<typeof SoftDeleteInput>;
export type RegionUpdateDataType = z.infer<typeof RegionDataUpdate>;
