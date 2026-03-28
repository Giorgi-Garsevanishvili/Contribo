/*
  Warnings:

  - Made the column `ratingScore` on table `AvailabilityEntry` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ratingScore` to the `AvailabilitySlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvailabilityEntry" ALTER COLUMN "ratingScore" SET NOT NULL;

-- AlterTable
ALTER TABLE "AvailabilitySlot" ADD COLUMN     "ratingScore" INTEGER NOT NULL;
