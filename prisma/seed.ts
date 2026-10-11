import prisma from "@/lib/prisma";
import {
  INITIAL_EVENT_ROLE_DATA,
  INITIAL_HR_WARNING_TYPE_DATA,
  INITIAL_MEMBER_STATUS_DATA,
  INITIAL_POSITION_DATA,
  INITIAL_REGION_DATA,
  INITIAL_ROLE_DATA,
} from "./seederData";
import { color, runSeedStep, seedData } from "./seedHelpers";
import { seedUser } from "./seedAllowedUser";

const main = async () => {
  const startedAt = Date.now();

  console.log(`\n${color(36, "🌱")} ${color(1, "CONTRIBO DATABASE SEED")}`);
  console.log(color(90, "─────────────────────────"));

  await runSeedStep(`Roles (${INITIAL_ROLE_DATA.length})`, () =>
    seedData({ data: INITIAL_ROLE_DATA, model: prisma.role }),
  );
  await runSeedStep(`Regions (${INITIAL_REGION_DATA.length})`, () =>
    seedData({ data: INITIAL_REGION_DATA, model: prisma.region }),
  );
  await runSeedStep("Initial allowed user", seedUser);
  await runSeedStep(`Event roles (${INITIAL_EVENT_ROLE_DATA.length})`, () =>
    seedData({ data: INITIAL_EVENT_ROLE_DATA, model: prisma.eventsRole }),
  );
  await runSeedStep(
    `HR warning types (${INITIAL_HR_WARNING_TYPE_DATA.length})`,
    () =>
      seedData({
        data: INITIAL_HR_WARNING_TYPE_DATA,
        model: prisma.hrWarningType,
      }),
  );
  await runSeedStep(
    `Member statuses (${INITIAL_MEMBER_STATUS_DATA.length})`,
    () =>
      seedData({
        data: INITIAL_MEMBER_STATUS_DATA,
        model: prisma.memberStatus,
      }),
  );
  await runSeedStep(`Positions (${INITIAL_POSITION_DATA.length})`, () =>
    seedData({ data: INITIAL_POSITION_DATA, model: prisma.position }),
  );

  const totalSeconds = ((Date.now() - startedAt) / 1000).toFixed(2);
  console.log(
    `\n${color(32, "🎉")} ${color(1, "All seed data completed")} ${color(
      90,
      `in ${totalSeconds}s`,
    )}\n`,
  );
};

main()
  .catch((error) => {
    console.error(`${color(31, "❌")} Database seeding failed`, error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
