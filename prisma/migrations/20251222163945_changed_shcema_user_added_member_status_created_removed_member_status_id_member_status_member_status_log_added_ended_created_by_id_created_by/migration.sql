/*
  Warnings:

  - You are about to drop the column `changedById` on the `MemberStatusLog` table. All the data in the column will be lost.
  - You are about to drop the column `memberStatusId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MemberStatusLog" DROP CONSTRAINT "MemberStatusLog_changedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_memberStatusId_fkey";

-- DropIndex
DROP INDEX "public"."MemberStatusLog_changedById_idx";

-- AlterTable
ALTER TABLE "MemberStatusLog" DROP COLUMN "changedById",
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "ended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "memberStatusId";

-- CreateIndex
CREATE INDEX "MemberStatusLog_updatedById_idx" ON "MemberStatusLog"("updatedById");

-- AddForeignKey
ALTER TABLE "MemberStatusLog" ADD CONSTRAINT "MemberStatusLog_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStatusLog" ADD CONSTRAINT "MemberStatusLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
