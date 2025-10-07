-- CreateEnum
CREATE TYPE "HrWarningStatus" AS ENUM ('ACTIVE', 'UNDER_REVIEW', 'APPROVED', 'ESCALATED', 'RESOLVED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "HrWarning" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "assigneeID" TEXT NOT NULL,
    "comment" TEXT,
    "status" "HrWarningStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "HrWarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HrWarningType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HrWarningType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrWarningType_name_key" ON "HrWarningType"("name");

-- AddForeignKey
ALTER TABLE "HrWarning" ADD CONSTRAINT "HrWarning_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "HrWarningType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrWarning" ADD CONSTRAINT "HrWarning_assigneeID_fkey" FOREIGN KEY ("assigneeID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HrWarning" ADD CONSTRAINT "HrWarning_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
