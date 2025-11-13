export type Context = {
  params: Promise<{ id: string }>;
};

export type AllowedUsersWithRelations = Prisma.AllowedUserGetPayload<{
  include: { role: true; region: true; createdBy: true };
}>;

export type GeneralDataWithRelations = Prisma.RoleGetPayload<{}>;