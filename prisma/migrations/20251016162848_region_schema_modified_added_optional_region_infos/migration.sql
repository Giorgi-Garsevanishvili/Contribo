/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "address" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Region_email_key" ON "Region"("email");
