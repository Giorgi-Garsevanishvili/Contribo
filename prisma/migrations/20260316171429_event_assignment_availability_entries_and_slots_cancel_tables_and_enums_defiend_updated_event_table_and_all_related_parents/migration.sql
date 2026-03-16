/*
  Warnings:

  - You are about to drop the `ScheduledEmails` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FeedbackRequestStatus" AS ENUM ('PENDING', 'SUBMITTED', 'IGNORED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'CANCEL_REQUESTED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "ScheduledEmails" DROP CONSTRAINT "ScheduledEmails_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduledEmails" DROP CONSTRAINT "ScheduledEmails_userId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "finalizedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EventAssignment" ADD COLUMN     "ratedAt" TIMESTAMP(3),
ADD COLUMN     "ratingScore" INTEGER,
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "ScheduledEmails";

-- CreateTable
CREATE TABLE "FeedbackRequest" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "FeedbackRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "eventFeedbackId" TEXT,

    CONSTRAINT "FeedbackRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilitySlot" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "totalSlots" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "AvailabilitySlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityEntry" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "comment" TEXT,
    "ratingScore" INTEGER,
    "ratedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryCancelRequest" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "reason" TEXT,
    "status" "ReqStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntryCancelRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentCancelRequest" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "reason" TEXT,
    "status" "ReqStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentCancelRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedbackRequest_eventId_idx" ON "FeedbackRequest"("eventId");

-- CreateIndex
CREATE INDEX "FeedbackRequest_userId_idx" ON "FeedbackRequest"("userId");

-- CreateIndex
CREATE INDEX "AvailabilitySlot_eventId_idx" ON "AvailabilitySlot"("eventId");

-- CreateIndex
CREATE INDEX "AvailabilityEntry_slotId_idx" ON "AvailabilityEntry"("slotId");

-- CreateIndex
CREATE INDEX "AvailabilityEntry_userId_idx" ON "AvailabilityEntry"("userId");

-- CreateIndex
CREATE INDEX "EntryCancelRequest_entryId_idx" ON "EntryCancelRequest"("entryId");

-- CreateIndex
CREATE INDEX "AssignmentCancelRequest_assignmentId_idx" ON "AssignmentCancelRequest"("assignmentId");

-- AddForeignKey
ALTER TABLE "FeedbackRequest" ADD CONSTRAINT "FeedbackRequest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackRequest" ADD CONSTRAINT "FeedbackRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackRequest" ADD CONSTRAINT "FeedbackRequest_eventFeedbackId_fkey" FOREIGN KEY ("eventFeedbackId") REFERENCES "EventFeedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilitySlot" ADD CONSTRAINT "AvailabilitySlot_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilitySlot" ADD CONSTRAINT "AvailabilitySlot_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilitySlot" ADD CONSTRAINT "AvailabilitySlot_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "EventsRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilitySlot" ADD CONSTRAINT "AvailabilitySlot_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityEntry" ADD CONSTRAINT "AvailabilityEntry_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "AvailabilitySlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityEntry" ADD CONSTRAINT "AvailabilityEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityEntry" ADD CONSTRAINT "AvailabilityEntry_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryCancelRequest" ADD CONSTRAINT "EntryCancelRequest_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "AvailabilityEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryCancelRequest" ADD CONSTRAINT "EntryCancelRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryCancelRequest" ADD CONSTRAINT "EntryCancelRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentCancelRequest" ADD CONSTRAINT "AssignmentCancelRequest_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "EventAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentCancelRequest" ADD CONSTRAINT "AssignmentCancelRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentCancelRequest" ADD CONSTRAINT "AssignmentCancelRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
