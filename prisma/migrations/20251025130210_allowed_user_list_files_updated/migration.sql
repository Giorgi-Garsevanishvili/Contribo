/*
  Warnings:

  - You are about to drop the column `userId` on the `AllowedUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AllowedUser" DROP CONSTRAINT "AllowedUser_userId_fkey";

-- AlterTable
ALTER TABLE "AllowedUser" DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT;

-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
