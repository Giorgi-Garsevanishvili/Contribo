/*
  Warnings:

  - You are about to drop the column `roleId` on the `AllowedUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AllowedUser" DROP CONSTRAINT "AllowedUser_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- AlterTable
ALTER TABLE "AllowedUser" DROP COLUMN "roleId";

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AllowedUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
