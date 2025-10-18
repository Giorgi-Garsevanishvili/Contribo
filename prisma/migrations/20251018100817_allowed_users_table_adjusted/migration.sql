/*
  Warnings:

  - Added the required column `regionId` to the `AllowedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AllowedUser" ADD COLUMN     "regionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
