/*
  Warnings:

  - You are about to drop the column `assigneeID` on the `HrWarning` table. All the data in the column will be lost.
  - Added the required column `assigneeId` to the `HrWarning` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."HrWarning" DROP CONSTRAINT "HrWarning_assigneeID_fkey";

-- AlterTable
ALTER TABLE "HrWarning" DROP COLUMN "assigneeID",
ADD COLUMN     "assigneeId" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- AddForeignKey
ALTER TABLE "HrWarning" ADD CONSTRAINT "HrWarning_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrWarning" ADD CONSTRAINT "HrWarning_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
