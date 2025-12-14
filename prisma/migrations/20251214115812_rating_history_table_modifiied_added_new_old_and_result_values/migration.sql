/*
  Warnings:

  - Added the required column `newValue` to the `RatingHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldValue` to the `RatingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RatingHistory" ADD COLUMN     "newValue" INTEGER NOT NULL,
ADD COLUMN     "oldValue" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;
