/*
  Warnings:

  - You are about to drop the column `regionId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_regionId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "regionId";
