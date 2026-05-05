/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AllowedUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AllowedUser_userId_key" ON "AllowedUser"("userId");
