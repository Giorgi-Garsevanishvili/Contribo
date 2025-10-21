-- CreateEnum
CREATE TYPE "RegionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'DEACTIVATED', 'PENDING');

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "status" "RegionStatus" NOT NULL DEFAULT 'PENDING';
