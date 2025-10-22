/*
  Warnings:

  - The `status` column on the `JoinRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `regStatus` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GTypes" AS ENUM ('SYSTEM', 'REGION');

-- CreateEnum
CREATE TYPE "ReqStatus" AS ENUM ('PENDING', 'REQUESTED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "AllowedUser" ADD COLUMN     "type" "GTypes" NOT NULL DEFAULT 'REGION';

-- AlterTable
ALTER TABLE "EventsRole" ADD COLUMN     "type" "GTypes" NOT NULL DEFAULT 'REGION';

-- AlterTable
ALTER TABLE "HrWarningType" ADD COLUMN     "type" "GTypes" NOT NULL DEFAULT 'REGION';

-- AlterTable
ALTER TABLE "JoinRequest" DROP COLUMN "status",
ADD COLUMN     "status" "ReqStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "MemberStatus" ADD COLUMN     "type" "GTypes" NOT NULL DEFAULT 'REGION';

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "type" "GTypes" NOT NULL DEFAULT 'REGION';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "regStatus",
ADD COLUMN     "reqStatus" "ReqStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "public"."RegStatus";
