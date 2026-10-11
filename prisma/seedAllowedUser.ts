import prisma from "@/lib/prisma";
import { INITIAL_REGION_DATA, INITIAL_USER_ROLE } from "./seederData";
import { color } from "./seedHelpers";

export const seedUser = async () => {
  const email = process.env.INITIAL_USER_EMAIL?.trim();

  if (!email) {
    throw new Error("INITIAL_USER_EMAIL is not set in .env!");
  }

  const existingUser = await prisma.allowedUser.findUnique({
    where: { email },
  });

  const user = await prisma.allowedUser.upsert({
    where: { email },
    update: { region: { connect: { name: INITIAL_REGION_DATA[0].name } } },
    create: {
      email,
      region: { connect: { name: INITIAL_REGION_DATA[0].name } },
    },
  });

  let rolesAdded = 0;
  let rolesAlreadyAssigned = 0;

  for (const roleName of INITIAL_USER_ROLE) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: roleName },
    });

    const existingRoleLink = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: role.id,
      },
    });

    if (existingRoleLink) rolesAlreadyAssigned++;
    else rolesAdded++;
  }

  console.log(
    existingUser
      ? `   ${color(33, "↩️")} Allowed user already existed.`
      : `   ${color(32, "➕")} Allowed user created.`,
  );
  console.log(
    `   ${color(36, "🔗")} Roles: ${color(32, `${rolesAdded} assigned`)} · ${color(
      33,
      `${rolesAlreadyAssigned} already assigned`,
    )}`,
  );
};
