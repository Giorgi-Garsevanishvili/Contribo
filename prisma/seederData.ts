import { Prisma } from "@/generated/client";

export const INITIAL_ROLE_DATA: Prisma.RoleCreateInput[] = [
  { name: "QIRVEX" },
  { name: "REGULAR" },
  { name: "ADMIN" },
  { name: "RESTRICT" },
];

export const INITIAL_EVENT_ROLE_DATA: Prisma.EventsRoleCreateInput[] = [
  { name: "OC" },
  { name: "CO-OC" },
  { name: "VOLUNTEER" },
  { name: "SAFETY TEAM" },
  { name: "SAFETY LEAD" },
  { name: "GROUPE LEADER" },
];

export const INITIAL_HR_WARNING_TYPE_DATA: Prisma.HrWarningTypeCreateInput[] = [
  { name: "VIOLATION" },
  { name: "CASE" },
  { name: "NOTE" },
  { name: "WARNING" },
];

export const INITIAL_MEMBER_STATUS_DATA: Prisma.MemberStatusCreateInput[] = [
  { name: "ACTIVE" },
  { name: "CANDIDATE" },
  { name: "NEW" },
  { name: "CONTRIBUTOR" },
];

export const INITIAL_POSITION_DATA: Prisma.PositionCreateInput[] = [
  { name: "PRESIDENT" },
  { name: "VICE PRESIDENT" },
  { name: "COMMUNICATIONS MANAGER" },
  { name: "EVENTS MANAGER" },
  { name: "PARTNERSHIP MANAGER" },
  { name: "IT MANAGER" },
  { name: "WEB ADMINISTRATOR" },
  { name: "EXTERNAL CONTRIBUTOR" },
  { name: "VP FOR DEVELOPMENT" },
  { name: "VP FOR GOVERNANCE" },
  { name: "MAIN AUDITOR" },
  { name: "FINANCIAL AUDITOR" },
  { name: "HR MANAGER" },
  { name: "TREASURER" },
  { name: "PROCEDURAL AUDITOR" },
  { name: "FINANCIAL MANAGER" },
];

export const INITIAL_USER_ROLE = ["QIRVEX", "ADMIN", "REGULAR"];

export const INITIAL_REGION_DATA: Prisma.RegionCreateInput[] = [
  { name: "INITIAL" },
];
