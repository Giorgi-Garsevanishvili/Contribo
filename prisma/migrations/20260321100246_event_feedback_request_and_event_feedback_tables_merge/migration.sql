/*
  Warnings:

  - You are about to drop the `FeedbackRequest` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId,userId]` on the table `EventFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "FeedbackRequest" DROP CONSTRAINT "FeedbackRequest_eventFeedbackId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackRequest" DROP CONSTRAINT "FeedbackRequest_eventId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackRequest" DROP CONSTRAINT "FeedbackRequest_userId_fkey";

-- AlterTable
ALTER TABLE "EventFeedback" ADD COLUMN     "requestStatus" "FeedbackRequestStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "respondedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "FeedbackRequest";

-- CreateIndex
CREATE UNIQUE INDEX "EventFeedback_eventId_userId_key" ON "EventFeedback"("eventId", "userId");
