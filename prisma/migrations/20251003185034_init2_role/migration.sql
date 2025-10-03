-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'regular');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'regular';
