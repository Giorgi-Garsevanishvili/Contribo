import { ReqStatus } from "@prisma/client";
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

export type SoftDeleteType = z.infer<typeof SoftDelete>;
export type SoftDeleteInputType = z.infer<typeof SoftDeleteInput>;
