/*
  Warnings:

  - You are about to drop the column `rating` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_email_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rating";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_allowedUserId_fkey" FOREIGN KEY ("allowedUserId") REFERENCES "AllowedUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
