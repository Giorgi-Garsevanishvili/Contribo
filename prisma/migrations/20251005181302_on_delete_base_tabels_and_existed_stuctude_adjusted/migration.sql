/*
  Warnings:

  - The values [pending,requested,approved,rejected] on the enum `RegStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RatingAction" AS ENUM ('INCREASE', 'DECREASE');

-- AlterEnum
BEGIN;
CREATE TYPE "RegStatus_new" AS ENUM ('PENDING', 'REQUESTED', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."JoinRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "regStatus" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "regStatus" TYPE "RegStatus_new" USING ("regStatus"::text::"RegStatus_new");
ALTER TABLE "JoinRequest" ALTER COLUMN "status" TYPE "RegStatus_new" USING ("status"::text::"RegStatus_new");
ALTER TYPE "RegStatus" RENAME TO "RegStatus_old";
ALTER TYPE "RegStatus_new" RENAME TO "RegStatus";
DROP TYPE "public"."RegStatus_old";
ALTER TABLE "JoinRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "User" ALTER COLUMN "regStatus" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."JoinRequest" DROP CONSTRAINT "JoinRequest_regionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JoinRequest" DROP CONSTRAINT "JoinRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MemberStatusLog" DROP CONSTRAINT "MemberStatusLog_memberStatusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MemberStatusLog" DROP CONSTRAINT "MemberStatusLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PositionHistory" DROP CONSTRAINT "PositionHistory_positionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PositionHistory" DROP CONSTRAINT "PositionHistory_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."PositionHistory" DROP CONSTRAINT "PositionHistory_userId_fkey";

-- AlterTable
ALTER TABLE "JoinRequest" ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "regionId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "MemberStatusLog" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "memberStatusId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PositionHistory" ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "positionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "regStatus" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "RatingHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "action" "RatingAction" NOT NULL,
    "reason" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RatingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RatingHistory_userId_idx" ON "RatingHistory"("userId");

-- CreateIndex
CREATE INDEX "RatingHistory_createdById_idx" ON "RatingHistory"("createdById");

-- AddForeignKey
ALTER TABLE "RatingHistory" ADD CONSTRAINT "RatingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingHistory" ADD CONSTRAINT "RatingHistory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionHistory" ADD CONSTRAINT "PositionHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionHistory" ADD CONSTRAINT "PositionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionHistory" ADD CONSTRAINT "PositionHistory_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStatusLog" ADD CONSTRAINT "MemberStatusLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStatusLog" ADD CONSTRAINT "MemberStatusLog_memberStatusId_fkey" FOREIGN KEY ("memberStatusId") REFERENCES "MemberStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
